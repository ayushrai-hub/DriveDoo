import React, { useState, useEffect, createContext } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { getData, updateDBData, resetDBData, exportDBData, importDBData } from "./services/dbServices";
import { saveAs } from "file-saver";
import Spinner from "react-bootstrap/Spinner";
import TopicCard from "./components/TopicCard/TopicCard";
import Topic from "./components/Topic/Topic";
import About from "./components/About/About";
import Footer from "./components/Footer/Footer";
import ReactGA from "react-ga4";
import "./App.css";

// Creating a theme context
export const ThemeContext = createContext(null);
export const ProgressContext = createContext(null);

function App() {
  // setting state for data received from the DB
  const [questionData, setquestionData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // if dark theme is enabled or not
  const [dark, setDark] = useState(false);

  // Progress statistics
  const [progressStats, setProgressStats] = useState({
    totalQuestions: 0,
    completedQuestions: 0,
    completionPercentage: 0,
    topicsCompleted: 0
  });

  // useEffect for fetching data from DB on load and init GA
  useEffect(() => {
    localStorage.removeItem("cid");
    ReactGA.initialize(process.env.REACT_APP_GA_TRACKING_ID);
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem("isDark");
    if (savedTheme !== null) {
      setDark(savedTheme === "true");
    }

    // Fetch data with error handling
    getData((QuestionData) => {
      if (QuestionData && QuestionData.length > 0) {
        setquestionData(QuestionData);
        calculateProgress(QuestionData);
        setLoading(false);
      } else {
        setError("Failed to load data. Please refresh the page.");
        setLoading(false);
      }
    }, (error) => {
      console.error("Error loading data:", error);
      setError("Failed to load data. Please refresh the page.");
      setLoading(false);
    });

  }, []);

  // Calculate progress statistics
  const calculateProgress = (data) => {
    if (!data || data.length === 0) return;

    let totalQuestions = 0;
    let completedQuestions = 0;
    let topicsCompleted = 0;

    data.forEach(topic => {
      const topicQuestions = topic.questions ? topic.questions.length : 0;
      totalQuestions += topicQuestions;
      
      const topicCompleted = topic.questions ? 
        topic.questions.filter(q => q.Done).length : 0;
      completedQuestions += topicCompleted;

      if (topicCompleted === topicQuestions && topicQuestions > 0) {
        topicsCompleted++;
      }
    });

    const completionPercentage = totalQuestions > 0 
      ? Math.round((completedQuestions / totalQuestions) * 100) 
      : 0;

    setProgressStats({
      totalQuestions,
      completedQuestions,
      completionPercentage,
      topicsCompleted
    });
  };

  // to update progress in '/' route and also update DB
  function updateData(key, topicData, topicPosition) {
    try {
      let reGenerateUpdatedData = questionData.map((topic, index) => {
        if (index === topicPosition) {
          updateDBData(key, topicData);
          return { topicName: topic.topicName, position: topic.position, ...topicData };
        } else {
          return topic;
        }
      });
      setquestionData(reGenerateUpdatedData);
      calculateProgress(reGenerateUpdatedData);
      
      // Track completion event in GA
      ReactGA.event({
        category: 'Progress',
        action: 'Question_Completed',
        label: key
      });
    } catch (error) {
      console.error("Error updating data:", error);
      setError("Failed to update progress. Please try again.");
    }
  }

  // reset and clear DB
  function resetData() {
    if (window.confirm("Are you sure you want to reset all progress? This action cannot be undone.")) {
      resetDBData((response) => {
        setquestionData([]);
        setProgressStats({
          totalQuestions: 0,
          completedQuestions: 0,
          completionPercentage: 0,
          topicsCompleted: 0
        });
        window.location.replace(window.location.origin);
      });
    }
  }

  // export 450DSA-Progress data
  function exportData(callback) {
    try {
      exportDBData((data) => {
        const exportData = {
          version: "2.0",
          exportDate: new Date().toISOString(),
          progressData: data
        };
        const fileData = JSON.stringify(exportData, null, 2);
        const blob = new Blob([fileData], { type: "application/json" });
        saveAs(blob, `450DSA-Progress-${new Date().toISOString().slice(0, 10)}.json`);
        
        // Track export event
        ReactGA.event({
          category: 'Export',
          action: 'Progress_Exported'
        });
        
        callback();
      });
    } catch (error) {
      console.error("Error exporting data:", error);
      setError("Failed to export data. Please try again.");
      callback();
    }
  }

  // import 450DSA-Progress data
  function importData(data, callback) {
    try {
      if (!data || !data.progressData) {
        throw new Error("Invalid import file format");
      }

      importDBData(data.progressData, (QuestionData) => {
        setquestionData(QuestionData);
        calculateProgress(QuestionData);
        callback();
        
        // Track import event
        ReactGA.event({
          category: 'Import',
          action: 'Progress_Imported'
        });
      });
    } catch (error) {
      console.error("Error importing data:", error);
      setError("Failed to import data. Please check the file format.");
      callback();
    }
  }

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = !dark;
    setDark(newTheme);
    localStorage.setItem("isDark", newTheme.toString());
    
    // Track theme change
    ReactGA.event({
      category: 'Theme',
      action: newTheme ? 'Dark_Theme_Enabled' : 'Light_Theme_Enabled'
    });
  };

  // Add bookmark functionality
  const toggleBookmark = (topicKey, questionIndex) => {
    try {
      const updatedData = questionData.map(topic => {
        if (topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() === topicKey) {
          const updatedQuestions = topic.questions.map((q, index) => {
            if (index === questionIndex) {
              return { ...q, Bookmark: !q.Bookmark };
            }
            return q;
          });
          return { ...topic, questions: updatedQuestions };
        }
        return topic;
      });

      setquestionData(updatedData);
      calculateProgress(updatedData);
      
      // Update database
      const topicToUpdate = updatedData.find(t => 
        t.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() === topicKey
      );
      if (topicToUpdate) {
        updateDBData(topicKey, {
          started: topicToUpdate.started,
          doneQuestions: topicToUpdate.doneQuestions,
          questions: topicToUpdate.questions
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      setError("Failed to update bookmark. Please try again.");
    }
  };

  // Add note functionality
  const updateNote = (topicKey, questionIndex, note) => {
    try {
      const updatedData = questionData.map(topic => {
        if (topic.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() === topicKey) {
          const updatedQuestions = topic.questions.map((q, index) => {
            if (index === questionIndex) {
              return { ...q, Notes: note };
            }
            return q;
          });
          return { ...topic, questions: updatedQuestions };
        }
        return topic;
      });

      setquestionData(updatedData);
      
      // Update database
      const topicToUpdate = updatedData.find(t => 
        t.topicName.replace(/[^A-Z0-9]+/gi, "_").toLowerCase() === topicKey
      );
      if (topicToUpdate) {
        updateDBData(topicKey, {
          started: topicToUpdate.started,
          doneQuestions: topicToUpdate.doneQuestions,
          questions: topicToUpdate.questions
        });
      }
    } catch (error) {
      console.error("Error updating note:", error);
      setError("Failed to update note. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className={`App ${dark ? 'dark' : ''}`}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: '100vh' }}>
          <div className="text-center">
            <Spinner animation="grow" variant="success" size="lg" />
            <h4 className="mt-3" style={{ color: dark ? "white" : "" }}>Loading DSA Tracker...</h4>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      <ProgressContext.Provider value={{ progressStats, toggleBookmark, updateNote }}>
        <Router>
          <div className={`App ${dark ? 'dark' : ''}`}>
            <div className="app-header">
              <h1 className="app-heading text-center mt-4" style={{ color: dark ? "white" : "" }}>
                450 DSA Cracker
              </h1>
              
              {/* Progress Summary */}
              {progressStats.totalQuestions > 0 && (
                <div className="progress-summary text-center mb-4">
                  <div className="row">
                    <div className="col-md-3">
                      <div className="stat-card">
                        <h5>{progressStats.completionPercentage}%</h5>
                        <p>Completion</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card">
                        <h5>{progressStats.completedQuestions}/{progressStats.totalQuestions}</h5>
                        <p>Questions Done</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card">
                        <h5>{progressStats.topicsCompleted}/15</h5>
                        <p>Topics Complete</p>
                      </div>
                    </div>
                    <div className="col-md-3">
                      <div className="stat-card">
                        <h5>{progressStats.totalQuestions - progressStats.completedQuestions}</h5>
                        <p>Remaining</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {error && (
              <div className="alert alert-danger text-center" role="alert">
                {error}
                <button 
                  className="btn btn-outline-danger btn-sm ms-2" 
                  onClick={() => setError(null)}
                >
                  Dismiss
                </button>
              </div>
            )}

            <Routes>
              {/* HOME AND ABOUT ROUTE */}
              <Route 
                path="/" 
                element={<TopicCard questionData={questionData} />} 
              />
              <Route 
                path="/about" 
                element={
                  <About 
                    resetData={resetData} 
                    exportData={exportData} 
                    importData={importData} 
                    setQuestionData={setquestionData}
                    progressStats={progressStats}
                  />
                } 
              />

              {/* TOPIC ROUTES */}
              <Route path="/array" element={<Topic data={questionData[0]} updateData={updateData} />} />
              <Route path="/matrix" element={<Topic data={questionData[1]} updateData={updateData} />} />
              <Route path="/string" element={<Topic data={questionData[2]} updateData={updateData} />} />
              <Route path="/search_sort" element={<Topic data={questionData[3]} updateData={updateData} />} />
              <Route path="/linked_list" element={<Topic data={questionData[4]} updateData={updateData} />} />
              <Route path="/binary_trees" element={<Topic data={questionData[5]} updateData={updateData} />} />
              <Route path="/bst" element={<Topic data={questionData[6]} updateData={updateData} />} />
              <Route path="/greedy" element={<Topic data={questionData[7]} updateData={updateData} />} />
              <Route path="/backtracking" element={<Topic data={questionData[8]} updateData={updateData} />} />
              <Route path="/stacks_queues" element={<Topic data={questionData[9]} updateData={updateData} />} />
              <Route path="/heap" element={<Topic data={questionData[10]} updateData={updateData} />} />
              <Route path="/graph" element={<Topic data={questionData[11]} updateData={updateData} />} />
              <Route path="/trie" element={<Topic data={questionData[12]} updateData={updateData} />} />
              <Route path="/dynamic_programming" element={<Topic data={questionData[13]} updateData={updateData} />} />
              <Route path="/bit_manipulation" element={<Topic data={questionData[14]} updateData={updateData} />} />
            </Routes>

            <Footer dark={dark} setDark={setDark} />
          </div>
        </Router>
      </ProgressContext.Provider>
    </ThemeContext.Provider>
  );
}

export default App;