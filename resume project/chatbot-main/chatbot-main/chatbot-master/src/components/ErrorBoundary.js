/**
 * Error Boundary component for the chatbot application
 * Catches JavaScript errors anywhere in the child component tree,
 * logs those errors, and displays a fallback UI.
 */

import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            hasError: false, 
            error: null, 
            errorInfo: null 
        };
    }

    static getDerivedStateFromError(error) {
        // Update state so the next render will show the fallback UI
        return { hasError: true };
    }

    componentDidCatch(error, errorInfo) {
        // Log error details for debugging
        console.error('Chatbot Error Boundary caught an error:', error);
        console.error('Error Info:', errorInfo);

        // Set error details in state for display
        this.setState({
            error: error,
            errorInfo: errorInfo
        });

        // In a production app, you might want to send this to an error reporting service
        // this.logErrorToService(error, errorInfo);
    }

    logErrorToService = (error, errorInfo) => {
        // Example of logging to an error reporting service
        // This would typically send to services like Sentry, LogRocket, etc.
        const errorReport = {
            message: error.message,
            stack: error.stack,
            componentStack: errorInfo.componentStack,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            url: window.location.href
        };

        // Send to error reporting service (example)
        // fetch('/api/errors', {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(errorReport)
        // });
    };

    handleReload = () => {
        // Reload the page to recover from the error
        window.location.reload();
    };

    handleGoHome = () => {
        // Navigate to home page
        window.location.href = '/';
    };

    render() {
        if (this.state.hasError) {
            // Fallback UI
            return (
                <div className="error-boundary">
                    <div className="error-boundary__content">
                        <div className="error-boundary__icon">
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="#ef4444"/>
                            </svg>
                        </div>
                        
                        <h2 className="error-boundary__title">Something went wrong</h2>
                        <p className="error-boundary__message">
                            We're sorry, but the chatbot encountered an unexpected error.
                        </p>
                        
                        <div className="error-boundary__actions">
                            <button 
                                className="error-boundary__button error-boundary__button--primary"
                                onClick={this.handleReload}
                                aria-label="Reload page"
                            >
                                Reload Page
                            </button>
                            <button 
                                className="error-boundary__button error-boundary__button--secondary"
                                onClick={this.handleGoHome}
                                aria-label="Go to home page"
                            >
                                Go Home
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="error-boundary__details">
                                <summary className="error-boundary__summary">Error Details (Development)</summary>
                                <div className="error-boundary__error-info">
                                    <p><strong>Error:</strong> {this.state.error.toString()}</p>
                                    <p><strong>Stack:</strong></p>
                                    <pre className="error-boundary__stack">{this.state.error.stack}</pre>
                                    {this.state.errorInfo && (
                                        <>
                                            <p><strong>Component Stack:</strong></p>
                                            <pre className="error-boundary__stack">{this.state.errorInfo.componentStack}</pre>
                                        </>
                                    )}
                                </div>
                            </details>
                        )}
                    </div>
                </div>
            );
        }

        // Render children normally
        return this.props.children;
    }
}

export default ErrorBoundary;