import {
  sanitizeHtml,
  isValidEmail,
  isValidUrl,
  escapeRegex,
  generateSecureRandomString,
  validateProjectData,
  validateSkillData,
  FormValidator,
  defaultValidationRules
} from '../../utils/security';

describe('Security Utils', () => {
  describe('sanitizeHtml', () => {
    test('should escape HTML characters', () => {
      const input = '<script>alert("xss")</script>';
      const expected = '<script>alert("xss")</script>';
      expect(sanitizeHtml(input)).toBe(expected);
    });

    test('should handle empty string', () => {
      expect(sanitizeHtml('')).toBe('');
    });

    test('should handle non-string input', () => {
      expect(sanitizeHtml(null)).toBe('');
      expect(sanitizeHtml(undefined)).toBe('');
      expect(sanitizeHtml(123)).toBe('');
    });

    test('should escape quotes and slashes', () => {
      const input = 'Test "quotes" and \'single quotes\' and /slashes/';
      const expected = 'Test "quotes" and &#x27;single quotes&#x27; and &#x2F;slashes&#x2F;';
      expect(sanitizeHtml(input)).toBe(expected);
    });
  });

  describe('isValidEmail', () => {
    test('should validate correct email addresses', () => {
      expect(isValidEmail('test@example.com')).toBe(true);
      expect(isValidEmail('user.name@domain.co.uk')).toBe(true);
      expect(isValidEmail('user+tag@example.org')).toBe(true);
    });

    test('should reject invalid email addresses', () => {
      expect(isValidEmail('invalid-email')).toBe(false);
      expect(isValidEmail('user@')).toBe(false);
      expect(isValidEmail('@domain.com')).toBe(false);
      expect(isValidEmail('user@domain')).toBe(false);
      expect(isValidEmail('')).toBe(false);
      expect(isValidEmail(null)).toBe(false);
      expect(isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidUrl', () => {
    test('should validate correct URLs', () => {
      expect(isValidUrl('https://example.com')).toBe(true);
      expect(isValidUrl('http://localhost:3000')).toBe(true);
      expect(isValidUrl('https://subdomain.example.com/path?query=value')).toBe(true);
    });

    test('should reject invalid URLs', () => {
      expect(isValidUrl('not-a-url')).toBe(false);
      expect(isValidUrl('')).toBe(false);
      expect(isValidUrl(null)).toBe(false);
      expect(isValidUrl(undefined)).toBe(false);
      expect(isValidUrl('javascript:alert("xss")')).toBe(false);
    });
  });

  describe('escapeRegex', () => {
    test('should escape special regex characters', () => {
      const input = 'test.string+with*special?chars^$()[]{}|\\';
      const expected = 'test\\.string\\+with\\*special\\?chars\\^\\$\\(\\)\\[\\]\\{\\}\\|\\\\';
      expect(escapeRegex(input)).toBe(expected);
    });

    test('should handle empty string', () => {
      expect(escapeRegex('')).toBe('');
    });

    test('should handle string without special characters', () => {
      const input = 'normalstring';
      expect(escapeRegex(input)).toBe(input);
    });
  });

  describe('generateSecureRandomString', () => {
    test('should generate string of correct length', () => {
      const length = 32;
      const result = generateSecureRandomString(length);
      expect(result).toHaveLength(length);
      expect(typeof result).toBe('string');
    });

    test('should generate different strings on multiple calls', () => {
      const result1 = generateSecureRandomString(16);
      const result2 = generateSecureRandomString(16);
      expect(result1).not.toBe(result2);
    });

    test('should only contain valid characters', () => {
      const result = generateSecureRandomString(100);
      const validChars = /^[A-Za-z0-9]+$/;
      expect(validChars.test(result)).toBe(true);
    });
  });

  describe('validateProjectData', () => {
    test('should validate correct project data', () => {
      const project = {
        title: 'Test Project',
        description: 'A test project description',
        skills: ['React', 'Node.js'],
        demo: 'https://example.com',
        source: 'https://github.com/user/repo'
      };
      expect(validateProjectData(project)).toBe(true);
    });

    test('should reject invalid project data', () => {
      expect(validateProjectData(null)).toBe(false);
      expect(validateProjectData({})).toBe(false);
      expect(validateProjectData({ title: 'Test' })).toBe(false);
      expect(validateProjectData({ title: 'Test', description: 'Desc' })).toBe(false);
      expect(validateProjectData({ title: 'Test', description: 'Desc', skills: 'not-array' })).toBe(false);
      expect(validateProjectData({ title: 'Test', description: 'Desc', skills: ['React'], demo: 'invalid-url' })).toBe(false);
    });

    test('should validate project data length limits', () => {
      const project = {
        title: 'a'.repeat(101), // Too long
        description: 'A test project',
        skills: ['React']
      };
      expect(validateProjectData(project)).toBe(false);

      const project2 = {
        title: 'Test',
        description: 'a'.repeat(501), // Too long
        skills: ['React']
      };
      expect(validateProjectData(project2)).toBe(false);
    });
  });

  describe('validateSkillData', () => {
    test('should validate correct skill data', () => {
      const skill = {
        name: 'React',
        level: 80,
        category: 'Frontend'
      };
      expect(validateSkillData(skill)).toBe(true);
    });

    test('should reject invalid skill data', () => {
      expect(validateSkillData(null)).toBe(false);
      expect(validateSkillData({})).toBe(false);
      expect(validateSkillData({ name: 'React' })).toBe(false);
      expect(validateSkillData({ name: 'React', level: 150 })).toBe(false); // Level too high
      expect(validateSkillData({ name: 'React', level: 0 })).toBe(false); // Level too low
      expect(validateSkillData({ name: 'React', level: 'not-a-number' })).toBe(false);
    });

    test('should validate skill data length limits', () => {
      const skill = {
        name: 'a'.repeat(51), // Too long
        level: 80,
        category: 'Frontend'
      };
      expect(validateSkillData(skill)).toBe(false);

      const skill2 = {
        name: 'React',
        level: 80,
        category: 'a'.repeat(31) // Too long
      };
      expect(validateSkillData(skill2)).toBe(false);
    });
  });

  describe('FormValidator', () => {
    test('should validate form data correctly', () => {
      const data = {
        email: 'test@example.com',
        message: 'This is a test message',
        name: 'John Doe'
      };

      const result = FormValidator.validate(data, defaultValidationRules);
      
      expect(result.isValid).toBe(true);
      expect(result.errors).toEqual({});
      expect(result.data.email).toBe('test@example.com');
      expect(result.data.message).toBe('This is a test message');
      expect(result.data.name).toBe('John Doe');
    });

    test('should detect validation errors', () => {
      const data = {
        email: 'invalid-email',
        message: 'Hi', // Too short
        name: '' // Empty
      };

      const result = FormValidator.validate(data, defaultValidationRules);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.email).toBe('Invalid email format');
      expect(result.errors.message).toBe('message must be at least 10 characters');
      expect(result.errors.name).toBe('name is required');
    });

    test('should sanitize form data', () => {
      const data = {
        email: 'test@example.com',
        message: '<script>alert("xss")</script>',
        name: 'John <script>Doe</script>'
      };

      const result = FormValidator.validate(data, defaultValidationRules);
      
      expect(result.isValid).toBe(true);
      expect(result.data.message).toBe('<script>alert("xss")</script>');
      expect(result.data.name).toBe('John <script>Doe</script>');
    });

    test('should handle missing fields', () => {
      const data = {
        email: 'test@example.com'
        // message and name missing
      };

      const result = FormValidator.validate(data, defaultValidationRules);
      
      expect(result.isValid).toBe(false);
      expect(result.errors.message).toBe('message is required');
      expect(result.errors.name).toBe('name is required');
      expect(result.data.email).toBe('test@example.com');
    });
  });
});