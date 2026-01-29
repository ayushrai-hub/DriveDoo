import React from 'react';
import { chatbotService } from './services/api';
import { validateInput, sanitizeForDisplay } from './utils/inputValidation';
import ErrorBoundary from './components/ErrorBoundary';
import styles from './styles/ChatApp.module.css';

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            input: '',
            isTyping: false,
            error: null,
            sessionId: null
        };
        this.messagesEndRef = React.createRef();
        this.inputRef = React.createRef();
    }

    componentDidMount() {
        // Generate a session ID for conversation context
        const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.setState({ sessionId: newSessionId });
        
        // Focus input on mount
        this.inputRef.current?.focus();
    }

    componentDidUpdate(prevProps, prevState) {
        // Scroll to bottom when messages change
        if (prevState.messages.length !== this.state.messages.length) {
            this.scrollToBottom();
        }
    }

    scrollToBottom = () => {
        this.messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    handleSubmit = async (e) => {
        e.preventDefault();
        
        // Clear any existing error
        this.setState({ error: null });

        const { input } = this.state;

        // Validate input
        try {
            validateInput(input);
        } catch (validationError) {
            this.setState({ error: validationError.message });
            return;
        }

        const userMessage = {
            id: Date.now(),
            text: sanitizeForDisplay(input),
            sender: 'user',
            timestamp: new Date().toLocaleTimeString()
        };

        this.setState(prevState => ({
            messages: [...prevState.messages, userMessage],
            input: '',
            isTyping: true
        }));

        try {
            // Send message using the API service
            const response = await chatbotService.sendMessage(input, this.state.sessionId);
            
            if (response.success) {
                const botMessage = {
                    id: Date.now() + 1,
                    text: sanitizeForDisplay(response.data.response || response.data.message || "I'm not sure how to respond to that."),
                    sender: 'bot',
                    timestamp: new Date().toLocaleTimeString()
                };
                this.setState(prevState => ({
                    messages: [...prevState.messages, botMessage]
                }));
            } else {
                throw new Error(response.message || 'Failed to get response from chatbot');
            }
        } catch (err) {
            console.error('Chat error:', err);
            this.setState({ 
                error: err.message || 'Failed to send message. Please try again.',
                isTyping: false
            });
            
            const errorMessage = {
                id: Date.now() + 1,
                text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
                sender: 'bot',
                timestamp: new Date().toLocaleTimeString()
            };
            this.setState(prevState => ({
                messages: [...prevState.messages, errorMessage]
            }));
        } finally {
            this.setState({ isTyping: false });
            // Refocus input after sending
            this.inputRef.current?.focus();
        }
    };

    handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSubmit(e);
        }
    };

    handleInputChange = (e) => {
        this.setState({ input: e.target.value });
    };

    clearConversation = () => {
        this.setState({ 
            messages: [],
            error: null
        });
        this.inputRef.current?.focus();
    };

    render() {
        const { messages, input, isTyping, error } = this.state;

        return (
            <ErrorBoundary>
                <div className={styles.chatContainer}>
                    {/* Skip link for screen readers */}
                    <a href="#chat-form" className={styles.skipLink}>
                        Skip to chat input
                    </a>

                    <div className={styles.chatHeader} role="banner">
                        <h1 className={styles.appTitle} id="chat-title">
                            AI Chatbot Assistant
                        </h1>
                        <p className="sr-only">
                            An intelligent chatbot that helps answer your questions and have conversations.
                        </p>
                    </div>
                    
                    <div 
                        className={styles.chatMessages} 
                        aria-live="polite"
                        aria-label="Chat messages"
                        role="log"
                    >
                        {messages.map((message) => (
                            <div 
                                key={message.id} 
                                className={`${styles.message} ${
                                    message.sender === 'user' ? styles.userMessage : styles.botMessage
                                }`}
                                role="listitem"
                                tabIndex="0"
                            >
                                <div className={styles.messageContent}>
                                    {message.text}
                                </div>
                                <span className={styles.messageTime} aria-label={`Sent at ${message.timestamp}`}>
                                    {message.timestamp}
                                </span>
                            </div>
                        ))}
                        
                        {isTyping && (
                            <div className={styles.typingIndicator} role="status" aria-live="polite">
                                <span className={styles.typingDot}></span>
                                <span className={styles.typingDot}></span>
                                <span className={styles.typingDot}></span>
                                <span className="sr-only">Chatbot is typing...</span>
                            </div>
                        )}
                        
                        {error && (
                            <div 
                                className={styles.errorMessage}
                                role="alert"
                                aria-live="assertive"
                            >
                                {error}
                            </div>
                        )}
                        
                        <div ref={this.messagesEndRef} />
                    </div>

                    <form 
                        onSubmit={this.handleSubmit} 
                        className={styles.chatForm}
                        id="chat-form"
                        noValidate
                    >
                        <div className="sr-only" aria-live="polite">
                            {messages.length} messages in conversation
                        </div>
                        
                        <input
                            ref={this.inputRef}
                            type="text"
                            value={input}
                            onChange={this.handleInputChange}
                            onKeyPress={this.handleKeyPress}
                            placeholder="Type your message here..."
                            className={styles.messageInput}
                            aria-label="Type your message"
                            aria-describedby="chat-instructions"
                            maxLength="1000"
                            autoComplete="off"
                        />
                        
                        <button 
                            type="submit" 
                            className={styles.sendButton}
                            disabled={isTyping || !input.trim()}
                            aria-label="Send message"
                        >
                            {isTyping ? 'Sending...' : 'Send'}
                        </button>
                    </form>

                    {/* Hidden instructions for screen readers */}
                    <div id="chat-instructions" className="srOnly">
                        Press Enter to send message, Shift+Enter for new line. 
                        Maximum message length is 1000 characters.
                    </div>
                </div>
            </ErrorBoundary>
        );
    }
}

export default App;
