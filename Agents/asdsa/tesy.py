import unittest
from pathlib import Path
import shutil
from lb import GradeManager, Student, Subject, Grade, GradeError, StudentError, DataPersistenceError

class TestGradeManagementSystem(unittest.TestCase):
    def setUp(self):
        self.test_data_dir = "test_grade_data"
        self.manager = GradeManager(data_dir=self.test_data_dir)
        
    def tearDown(self):
        if Path(self.test_data_dir).exists():
            shutil.rmtree(self.test_data_dir)
    
    def test_student_creation(self):
        self.manager.add_student(101, "John Doe")
        self.assertIn(101, self.manager.students)
        self.assertEqual(self.manager.students[101].name, "John Doe")
        
        with self.assertRaises(StudentError):
            self.manager.add_student(101, "Jane Doe")  # Duplicate ID
        
        with self.assertRaises(StudentError):
            self.manager.add_student(-1, "Invalid ID")  # Negative ID
            
        with self.assertRaises(StudentError):
            self.manager.add_student(102, "")  # Empty name
    
    def test_grade_addition(self):
        self.manager.add_student(101, "John Doe")
        
        self.manager.add_grade(101, "Math", 85.5)
        student = self.manager.students[101]
        self.assertIn("Math", student.subjects)
        self.assertEqual(student.subjects["Math"].grades[0], 85.5)
        
        with self.assertRaises(GradeError):
            self.manager.add_grade(101, "Math", -10)  # Negative grade
            
        with self.assertRaises(GradeError):
            self.manager.add_grade(101, "Math", 110)  # Grade > 100
            
        with self.assertRaises(StudentError):
            self.manager.add_grade(999, "Math", 85)  # Non-existent student
    
    def test_subject_normalization(self):
        self.manager.add_student(101, "John Doe")
        
        self.manager.add_grade(101, "MATH", 85)
        self.manager.add_grade(101, "math", 90)
        self.manager.add_grade(101, "Math ", 95)
        
        student = self.manager.students[101]
        self.assertEqual(len(student.subjects), 1)  # All should go to same subject
        self.assertEqual(len(student.subjects["Math"].grades), 3)
    
    def test_grade_averaging(self):
        self.manager.add_student(101, "John Doe")
        
        grades = [85.5, 90.5, 88.0]
        for grade in grades:
            self.manager.add_grade(101, "Math", grade)
            
        subject = self.manager.students[101].subjects["Math"]
        expected_avg = sum(grades) / len(grades)
        self.assertAlmostEqual(subject.average, expected_avg, places=2)
    
    def test_letter_grade_calculation(self):
        self.manager.add_student(101, "John Doe")
        
        grade_tests = [
            (95, "A"),
            (85, "B"),
            (75, "C"),
            (65, "D"),
            (55, "F")
        ]
        
        for numeric_grade, expected_letter in grade_tests:
            self.manager.add_grade(101, f"Subject_{numeric_grade}", numeric_grade)
            subject = self.manager.students[101].subjects[f"Subject_{numeric_grade}"]
            self.assertEqual(subject.letter_grade, expected_letter)
    
    def test_report_generation(self):
        self.manager.add_student(101, "John Doe")
        self.manager.add_grade(101, "Math", 85)
        
        text_report = self.manager.generate_report(101, "text")
        self.assertIsInstance(text_report, str)
        self.assertIn("John Doe", text_report)
        self.assertIn("Math", text_report)
        
        json_report = self.manager.generate_report(101, "json")
        self.assertIsInstance(json_report, dict)
        self.assertEqual(json_report["name"], "John Doe")
        
        csv_report = self.manager.generate_report(101, "csv")
        self.assertIsInstance(csv_report, dict)
        self.assertIn("headers", csv_report)
        self.assertIn("data", csv_report)
    
    def test_data_persistence(self):
        self.manager.add_student(101, "John Doe")
        self.manager.add_grade(101, "Math", 85)
        
        self.manager._save_data()
        
        new_manager = GradeManager(data_dir=self.test_data_dir)
        new_manager.load_data()
        
        self.assertIn(101, new_manager.students)
        self.assertEqual(new_manager.students[101].name, "John Doe")
        self.assertIn("Math", new_manager.students[101].subjects)
    
    def test_max_grades_limit(self):
        self.manager.add_student(101, "John Doe")
        subject = Subject("Math", max_grades=3)
        
        for grade in [85, 90, 95]:
            subject.add_grade(grade)
            
        with self.assertRaises(GradeError):
            subject.add_grade(88)  # Should exceed max_grades limit

if __name__ == '_main_':
    unittest.main(verbosity=2)