import { getImageUrl } from '../utils';

// Mock import.meta.url
Object.defineProperty(global, 'import', {
  value: {
    meta: {
      url: 'http://localhost:3000/'
    }
  },
  writable: true,
});

describe('Utils', () => {
  describe('getImageUrl', () => {
    test('should return correct URL for image path', () => {
      const imagePath = 'hero/heroImage.png';
      const expectedUrl = 'http://localhost:3000/assets/hero/heroImage.png';
      
      const result = getImageUrl(imagePath);
      expect(result).toBe(expectedUrl);
    });

    test('should handle different image file types', () => {
      const pngPath = 'projects/project.png';
      const jpgPath = 'about/image.jpg';
      const svgPath = 'icons/icon.svg';
      
      expect(getImageUrl(pngPath)).toBe('http://localhost:3000/assets/projects/project.png');
      expect(getImageUrl(jpgPath)).toBe('http://localhost:3000/assets/about/image.jpg');
      expect(getImageUrl(svgPath)).toBe('http://localhost:3000/assets/icons/icon.svg');
    });

    test('should handle nested directory paths', () => {
      const nestedPath = 'skills/frontend/react.png';
      const expectedUrl = 'http://localhost:3000/assets/skills/frontend/react.png';
      
      const result = getImageUrl(nestedPath);
      expect(result).toBe(expectedUrl);
    });

    test('should handle empty path', () => {
      const result = getImageUrl('');
      expect(result).toBe('http://localhost:3000/assets/');
    });

    test('should handle path with special characters', () => {
      const specialPath = 'hero/hero-image_v2.png';
      const expectedUrl = 'http://localhost:3000/assets/hero/hero-image_v2.png';
      
      const result = getImageUrl(specialPath);
      expect(result).toBe(expectedUrl);
    });

    test('should return URL object href property', () => {
      const imagePath = 'test/image.png';
      const result = getImageUrl(imagePath);
      
      // The function should return a string (the href property of URL object)
      expect(typeof result).toBe('string');
      expect(result).toMatch(/^http/);
      expect(result).toContain('/assets/');
      expect(result).toContain('image.png');
    });
  });
});