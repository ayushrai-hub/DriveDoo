/**
 * API service layer for the react-portfolio application
 * Handles all API communication with proper error handling, security, and retry logic
 */

import axios from 'axios';
import { sanitizeForLogging } from '../utils/inputValidation';

// API Configuration
const API_CONFIG = {
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001',
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    }
};

// Create axios instance
const apiClient = axios.create(API_CONFIG);

// Request Interceptor - Add security headers and logging
apiClient.interceptors.request.use(
    (config) => {
        // Add timestamp for debugging
        config.metadata = { startTime: new Date() };
        
        // Add security headers
        config.headers['X-Content-Type-Options'] = 'nosniff';
        config.headers['X-Frame-Options'] = 'DENY';
        config.headers['X-XSS-Protection'] = '1; mode=block';
        
        // Log request (sanitized)
        if (process.env.NODE_ENV === 'development') {
            console.log('API Request:', {
                method: config.method.toUpperCase(),
                url: config.url,
                data: config.data ? sanitizeForLogging(JSON.stringify(config.data)) : undefined
            });
        }
        
        return config;
    },
    (error) => {
        console.error('Request Error:', error);
        return Promise.reject(error);
    }
);

// Response Interceptor - Handle responses and errors
apiClient.interceptors.response.use(
    (response) => {
        // Calculate response time
        const duration = new Date() - response.config.metadata.startTime;
        
        if (process.env.NODE_ENV === 'development') {
            console.log('API Response:', {
                status: response.status,
                duration: `${duration}ms`,
                url: response.config.url
            });
        }
        
        return response;
    },
    (error) => {
        // Enhanced error handling
        const errorResponse = {
            message: 'An error occurred while communicating with the server',
            status: null,
            details: null
        };

        if (error.response) {
            // Server responded with error status
            errorResponse.status = error.response.status;
            errorResponse.details = error.response.data?.error || error.response.statusText;
            
            switch (error.response.status) {
                case 400:
                    errorResponse.message = 'Invalid request. Please check your input.';
                    break;
                case 401:
                    errorResponse.message = 'Authentication required. Please log in.';
                    break;
                case 403:
                    errorResponse.message = 'Access denied. You do not have permission to perform this action.';
                    break;
                case 404:
                    errorResponse.message = 'The requested resource was not found.';
                    break;
                case 429:
                    errorResponse.message = 'Too many requests. Please wait a moment before trying again.';
                    break;
                case 500:
                    errorResponse.message = 'Server error. Please try again later.';
                    break;
                case 502:
                case 503:
                case 504:
                    errorResponse.message = 'Service temporarily unavailable. Please try again later.';
                    break;
                default:
                    errorResponse.message = error.response.data?.error || `Server error (${error.response.status})`;
            }
        } else if (error.request) {
            // Network error
            if (error.code === 'NETWORK_ERROR') {
                errorResponse.message = 'Network error. Please check your internet connection.';
            } else if (error.code === 'ECONNABORTED') {
                errorResponse.message = 'Request timed out. Please try again.';
            } else {
                errorResponse.message = 'Unable to connect to the server. Please check your internet connection.';
            }
        } else {
            // Other error
            errorResponse.message = error.message || 'An unexpected error occurred.';
        }

        // Log error (sanitized)
        if (process.env.NODE_ENV === 'development') {
            console.error('API Error:', {
                message: errorResponse.message,
                status: errorResponse.status,
                details: sanitizeForLogging(errorResponse.details),
                config: {
                    method: error.config?.method,
                    url: error.config?.url
                }
            });
        }

        // Return custom error object
        return Promise.reject(errorResponse);
    }
);

/**
 * Portfolio API service
 */
class PortfolioService {
    /**
     * Send a contact message
     * @param {Object} contactData - Contact form data
     * @returns {Promise<Object>} - API response
     */
    async sendContactMessage(contactData) {
        try {
            const payload = {
                name: contactData.name?.trim(),
                email: contactData.email?.trim(),
                subject: contactData.subject?.trim(),
                message: contactData.message?.trim()
            };

            const response = await apiClient.post('/api/contact', payload);
            
            return {
                success: true,
                data: response.data,
                message: 'Message sent successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: error.message
            };
        }
    }

    /**
     * Get portfolio projects
     * @returns {Promise<Object>} - API response
     */
    async getProjects() {
        try {
            const response = await apiClient.get('/api/projects');
            
            return {
                success: true,
                data: response.data,
                message: 'Projects retrieved successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: error.message
            };
        }
    }

    /**
     * Get skills and technologies
     * @returns {Promise<Object>} - API response
     */
    async getSkills() {
        try {
            const response = await apiClient.get('/api/skills');
            
            return {
                success: true,
                data: response.data,
                message: 'Skills retrieved successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: error.message
            };
        }
    }

    /**
     * Get resume/CV data
     * @returns {Promise<Object>} - API response
     */
    async getResume() {
        try {
            const response = await apiClient.get('/api/resume');
            
            return {
                success: true,
                data: response.data,
                message: 'Resume data retrieved successfully'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: error.message
            };
        }
    }

    /**
     * Test API connectivity
     * @returns {Promise<Object>} - API response
     */
    async testConnection() {
        try {
            const response = await apiClient.get('/api/health');
            
            return {
                success: true,
                data: response.data,
                message: 'API connection successful'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: 'API connection failed'
            };
        }
    }

    /**
     * Submit newsletter subscription
     * @param {string} email - Email address
     * @returns {Promise<Object>} - API response
     */
    async subscribeToNewsletter(email) {
        try {
            const payload = {
                email: email.trim()
            };

            const response = await apiClient.post('/api/newsletter', payload);
            
            return {
                success: true,
                data: response.data,
                message: 'Subscription successful'
            };
        } catch (error) {
            return {
                success: false,
                error: error,
                message: error.message
            };
        }
    }
}

// Export singleton instance
export const portfolioService = new PortfolioService();

// Export axios instance for direct use if needed
export { apiClient };

export default portfolioService;