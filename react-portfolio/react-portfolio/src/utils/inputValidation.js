/**
 * Input validation and sanitization utilities for the react-portfolio application
 * Provides security against XSS and injection attacks
 */

import DOMPurify from 'dompurify';

/**
 * Validates and sanitizes user input to prevent XSS and injection attacks
 * @param {string} input - The user input to validate
 * @returns {string} - Sanitized input
 * @throws {Error} - If input fails validation
 */
export const validateInput = (input) => {
    // Check if input exists and is not empty
    if (!input || typeof input !== 'string') {
        throw new Error('Input cannot be empty');
    }

    // Trim whitespace
    const trimmedInput = input.trim();
    
    if (trimmedInput.length === 0) {
        throw new Error('Input cannot be empty');
    }

    // Length validation
    if (trimmedInput.length > 1000) {
        throw new Error('Input too long (max 1000 characters)');
    }

    // Sanitize HTML to prevent XSS
    const sanitized = DOMPurify.sanitize(trimmedInput, {
        ALLOWED_TAGS: [], // No HTML tags allowed
        ALLOWED_ATTR: [], // No attributes allowed
        ALLOW_DATA_ATTR: false
    });

    // Check if sanitization changed the input (indicating dangerous content)
    if (sanitized !== trimmedInput) {
        throw new Error('Invalid characters detected');
    }

    // Additional validation for dangerous patterns that might bypass sanitization
    const dangerousPatterns = [
        /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
        /javascript:/gi,
        /on\w+\s*=/gi,
        /<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
        /<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
        /<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
        /<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi,
        /<input\b[^<]*(?:(?!<\/input>)<[^<]*)*<\/input>/gi,
        /<link\b[^<]*(?:(?!<\/link>)<[^<]*)*<\/link>/gi,
        /<meta\b[^<]*(?:(?!<\/meta>)<[^<]*)*<\/meta>/gi
    ];

    for (const pattern of dangerousPatterns) {
        if (pattern.test(trimmedInput)) {
            throw new Error('Invalid characters detected');
        }
    }

    // Check for SQL injection patterns
    const sqlPatterns = [
        /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
        /('|(\\')|(;)|(--)|(\||(\|\|))|(&&)|(%27|%22|%3B|%2D%2D|%7C|%7C%7C|%26%26))/gi
    ];

    for (const pattern of sqlPatterns) {
        if (pattern.test(sanitized)) {
            throw new Error('Invalid characters detected');
        }
    }

    return sanitized;
};

/**
 * Validates message format and content
 * @param {string} message - The message to validate
 * @returns {boolean} - Whether the message is valid
 */
export const isValidMessage = (message) => {
    try {
        validateInput(message);
        return true;
    } catch {
        return false;
    }
};

/**
 * Sanitizes message for display in the UI
 * @param {string} message - The message to sanitize for display
 * @returns {string} - Sanitized message safe for display
 */
export const sanitizeForDisplay = (message) => {
    if (!message || typeof message !== 'string') {
        return '';
    }

    // Basic HTML escaping for display
    return message
        .replace(/&/g, '&')
        .replace(/</g, '<')
        .replace(/>/g, '>')
        .replace(/"/g, '"')
        .replace(/'/g, '&#039;');
};

/**
 * Validates message length and format for API requests
 * @param {string} message - The message to validate
 * @returns {object} - Validation result with isValid and error properties
 */
export const validateMessageForAPI = (message) => {
    try {
        validateInput(message);
        return {
            isValid: true,
            error: null
        };
    } catch (error) {
        return {
            isValid: false,
            error: error.message
        };
    }
};

/**
 * Sanitizes user input for logging purposes (removes sensitive data)
 * @param {string} input - The input to sanitize for logging
 * @returns {string} - Sanitized input safe for logging
 */
export const sanitizeForLogging = (input) => {
    if (!input || typeof input !== 'string') {
        return '';
    }

    // Remove potentially sensitive patterns
    return input
        .replace(/\b(password|passwd|pwd)\s*[:=]\s*\S+/gi, '[REDACTED_PASSWORD]')
        .replace(/\b(token|api_key|apikey)\s*[:=]\s*\S+/gi, '[REDACTED_TOKEN]')
        .replace(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g, '[REDACTED_IP]')
        .replace(/\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g, '[REDACTED_EMAIL]');
};

export default {
    validateInput,
    isValidMessage,
    sanitizeForDisplay,
    validateMessageForAPI,
    sanitizeForLogging
};