/**
 * Security utilities for React Portfolio application
 * Note: Since this is a static portfolio site, security is primarily focused on
 * content security and preventing XSS in dynamic content
 */

/**
 * Sanitize HTML content to prevent XSS attacks
 * @param {string} input - Input string to sanitize
 * @returns {string} - Sanitized string
 */
export function sanitizeHtml(input) {
  if (typeof input !== 'string') {
    return '';
  }
  
  return input
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
}

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - Whether email is valid
 */
export function isValidEmail(email) {
  if (typeof email !== 'string') {
    return false;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - Whether URL is valid
 */
export function isValidUrl(url) {
  if (typeof url !== 'string') {
    return false;
  }
  
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Escape special characters for regex
 * @param {string} string - String to escape
 * @returns {string} - Escaped string
 */
export function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Generate a secure random string
 * @param {number} length - Length of the string
 * @returns {string} - Random string
 */
export function generateSecureRandomString(length = 32) {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const array = new Uint8Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += charset[array[i] % charset.length];
    }
  } else {
    // Fallback for environments without crypto
    for (let i = 0; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }
  }
  
  return result;
}

/**
 * Validate project data to prevent malicious content
 * @param {Object} project - Project object to validate
 * @returns {boolean} - Whether project data is valid
 */
export function validateProjectData(project) {
  if (!project || typeof project !== 'object') {
    return false;
  }
  
  const { title, description, skills, demo, source } = project;
  
  // Validate required fields
  if (!title || !description || !Array.isArray(skills)) {
    return false;
  }
  
  // Sanitize and validate title
  if (typeof title !== 'string' || title.length > 100) {
    return false;
  }
  
  // Sanitize and validate description
  if (typeof description !== 'string' || description.length > 500) {
    return false;
  }
  
  // Validate skills array
  if (!skills.every(skill => typeof skill === 'string' && skill.length <= 50)) {
    return false;
  }
  
  // Validate optional URLs
  if (demo && !isValidUrl(demo)) {
    return false;
  }
  
  if (source && !isValidUrl(source)) {
    return false;
  }
  
  return true;
}

/**
 * Validate skill data
 * @param {Object} skill - Skill object to validate
 * @returns {boolean} - Whether skill data is valid
 */
export function validateSkillData(skill) {
  if (!skill || typeof skill !== 'object') {
    return false;
  }
  
  const { name, level, category } = skill;
  
  // Validate required fields
  if (!name || !level || !category) {
    return false;
  }
  
  // Validate name
  if (typeof name !== 'string' || name.length > 50) {
    return false;
  }
  
  // Validate level (should be 1-100)
  const levelNum = parseInt(level, 10);
  if (isNaN(levelNum) || levelNum < 1 || levelNum > 100) {
    return false;
  }
  
  // Validate category
  if (typeof category !== 'string' || category.length > 30) {
    return false;
  }
  
  return true;
}

/**
 * Content Security Policy utilities
 */
export const CSPUtils = {
  /**
   * Check if a URL is allowed by CSP
   * @param {string} url - URL to check
   * @param {string[]} allowedDomains - Array of allowed domains
   * @returns {boolean} - Whether URL is allowed
   */
  isUrlAllowed(url, allowedDomains = []) {
    if (!url || typeof url !== 'string') {
      return false;
    }
    
    try {
      const urlObj = new URL(url);
      return allowedDomains.includes(urlObj.hostname);
    } catch {
      return false;
    }
  },
  
  /**
   * Generate CSP header string
   * @param {Object} policies - CSP policies
   * @returns {string} - CSP header string
   */
  generateCSPHeader(policies = {}) {
    const defaults = {
      'default-src': ["'self'"],
      'script-src': ["'self'", "'unsafe-inline'"],
      'style-src': ["'self'", "'unsafe-inline'"],
      'img-src': ["'self'", 'data:', 'https:'],
      'font-src': ["'self'"],
      'connect-src': ["'self'"],
      'frame-src': [],
      'object-src': ["'none'"],
      'base-uri': ["'self'"],
      'form-action': ["'self'"],
    };
    
    const mergedPolicies = { ...defaults, ...policies };
    const policyParts = [];
    
    Object.entries(mergedPolicies).forEach(([directive, sources]) => {
      if (Array.isArray(sources) && sources.length > 0) {
        policyParts.push(`${directive} ${sources.join(' ')}`);
      }
    });
    
    return policyParts.join('; ');
  }
};

/**
 * Input validation middleware for forms
 */
export const FormValidator = {
  /**
   * Validate form data
   * @param {Object} data - Form data to validate
   * @param {Object} rules - Validation rules
   * @returns {Object} - Validation result
   */
  validate(data, rules) {
    const errors = {};
    const sanitizedData = {};
    
    Object.entries(rules).forEach(([field, rule]) => {
      const value = data[field];
      
      // Required field check
      if (rule.required && (!value || value.toString().trim() === '')) {
        errors[field] = `${field} is required`;
        return;
      }
      
      if (!value) {
        sanitizedData[field] = '';
        return;
      }
      
      // Type validation
      if (rule.type === 'email' && !isValidEmail(value)) {
        errors[field] = 'Invalid email format';
        return;
      }
      
      if (rule.type === 'url' && !isValidUrl(value)) {
        errors[field] = 'Invalid URL format';
        return;
      }
      
      // Length validation
      if (rule.minLength && value.length < rule.minLength) {
        errors[field] = `${field} must be at least ${rule.minLength} characters`;
        return;
      }
      
      if (rule.maxLength && value.length > rule.maxLength) {
        errors[field] = `${field} must be no more than ${rule.maxLength} characters`;
        return;
      }
      
      // Sanitize the value
      sanitizedData[field] = sanitizeHtml(value.toString());
    });
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors,
      data: sanitizedData
    };
  }
};

/**
 * Security headers for development
 */
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
};

// Export default validation rules for common forms
export const defaultValidationRules = {
  email: {
    required: true,
    type: 'email',
    maxLength: 100
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 1000
  },
  name: {
    required: true,
    minLength: 2,
    maxLength: 50
  }
};