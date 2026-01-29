/**
 * Performance utilities for React Portfolio application
 */

/**
 * Debounce function to limit function calls
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @param {boolean} immediate - Whether to call immediately
 * @returns {Function} - Debounced function
 */
export function debounce(func, wait, immediate = false) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func(...args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func(...args);
  };
}

/**
 * Throttle function to limit function calls
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/**
 * Lazy load images with intersection observer
 * @param {string} selector - CSS selector for images
 */
export function lazyLoadImages(selector = 'img[data-src]') {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove('lazy');
          img.classList.add('loaded');
          observer.unobserve(img);
        }
      });
    });

    document.querySelectorAll(selector).forEach(img => {
      imageObserver.observe(img);
    });
  } else {
    // Fallback for browsers that don't support IntersectionObserver
    document.querySelectorAll(selector).forEach(img => {
      img.src = img.dataset.src;
      img.classList.remove('lazy');
      img.classList.add('loaded');
    });
  }
}

/**
 * Preload critical images
 * @param {string[]} imageUrls - Array of image URLs to preload
 */
export function preloadImages(imageUrls) {
  imageUrls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

/**
 * Get image with WebP support and fallback
 * @param {string} imagePath - Path to image
 * @returns {string} - Optimized image URL
 */
export function getOptimizedImage(imagePath) {
  // Check if WebP is supported
  const webpSupported = checkWebPSupport();
  
  if (webpSupported && imagePath.includes('.png')) {
    // Replace .png with .webp for WebP support
    return imagePath.replace('.png', '.webp');
  }
  
  return imagePath;
}

/**
 * Check if WebP format is supported
 * @returns {boolean} - WebP support status
 */
function checkWebPSupport() {
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
}

/**
 * Generate responsive image srcset
 * @param {string} basePath - Base path without extension
 * @param {string} extension - File extension
 * @param {number[]} sizes - Array of widths
 * @returns {string} - Srcset string
 */
export function generateSrcset(basePath, extension, sizes = [300, 600, 900, 1200]) {
  return sizes.map(size => `${basePath}_${size}w.${extension} ${size}w`).join(', ');
}

/**
 * Performance monitoring utilities
 */
export class PerformanceMonitor {
  constructor() {
    this.metrics = {};
    this.observers = [];
  }

  /**
   * Measure component render time
   * @param {string} componentName - Name of component
   * @param {Function} renderFunction - Function to measure
   */
  measureRender(componentName, renderFunction) {
    const startTime = performance.now();
    const result = renderFunction();
    const endTime = performance.now();
    
    this.metrics[componentName] = {
      renderTime: endTime - startTime,
      timestamp: Date.now()
    };
    
    return result;
  }

  /**
   * Monitor Core Web Vitals
   */
  observeWebVitals() {
    if ('PerformanceObserver' in window) {
      // Observe Largest Contentful Paint (LCP)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.metrics.lcp = lastEntry.startTime;
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Observe First Input Delay (FID)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.metrics.fid = entry.processingStart - entry.startTime;
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Observe Cumulative Layout Shift (CLS)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        }
        this.metrics.cls = clsValue;
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });

      this.observers.push(lcpObserver, fidObserver, clsObserver);
    }
  }

  /**
   * Get all performance metrics
   */
  getMetrics() {
    return {
      ...this.metrics,
      navigation: performance.getEntriesByType('navigation')[0],
      resource: performance.getEntriesByType('resource')
    };
  }

  /**
   * Log performance metrics
   */
  logMetrics() {
    const metrics = this.getMetrics();
    console.group('Performance Metrics');
    Object.keys(metrics).forEach(key => {
      console.log(`${key}:`, metrics[key]);
    });
    console.groupEnd();
  }

  /**
   * Clean up observers
   */
  disconnect() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

/**
 * Bundle size optimization utilities
 */
export class BundleOptimizer {
  /**
   * Dynamic import wrapper with error handling
   * @param {Function} importFunction - Dynamic import function
   * @param {Object} options - Options for loading
   */
  static async loadComponent(importFunction, options = {}) {
    const { fallback = null, retryCount = 3 } = options;
    
    for (let i = 0; i < retryCount; i++) {
      try {
        const module = await importFunction();
        return module.default || module;
      } catch (error) {
        console.warn(`Failed to load component (attempt ${i + 1}):`, error);
        
        if (i === retryCount - 1 && fallback) {
          return fallback;
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  /**
   * Code splitting helper for route-based splitting
   * @param {Function} importFunction - Dynamic import function
   */
  static createLazyComponent(importFunction) {
    return React.lazy(() => this.loadComponent(importFunction));
  }
}

// Export default performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Auto-start web vitals monitoring
if (typeof window !== 'undefined') {
  performanceMonitor.observeWebVitals();
}

// Preload critical images on page load
if (typeof window !== 'undefined') {
  window.addEventListener('load', () => {
    const criticalImages = [
      '/assets/hero/heroImage.png',
      '/assets/about/aboutImage.png'
    ];
    preloadImages(criticalImages);
  });
}