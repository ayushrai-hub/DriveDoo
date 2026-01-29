# React Portfolio

A modern, secure, and performant React portfolio website built with React 18, Vite, and comprehensive security measures.

## Overview

This portfolio website showcases modern React development practices with enterprise-grade security, comprehensive testing, and performance optimization. The project demonstrates best practices for building production-ready React applications.

## Features

### Core Functionality
- ✅ **Hero Section**: Professional introduction with contact information
- ✅ **About Section**: Skills, experience, and personal information
- ✅ **Experience Section**: Professional history and company information
- ✅ **Projects Section**: Showcase of completed projects with descriptions
- ✅ **Contact Section**: Social media links and contact information

### Security Features
- ✅ **XSS Prevention**: DOMPurify integration for all user inputs
- ✅ **Input Validation**: Comprehensive validation with length limits and pattern matching
- ✅ **SQL Injection Prevention**: Pattern detection for malicious inputs
- ✅ **Content Sanitization**: Multiple sanitization functions for different contexts
- ✅ **Logging Security**: Sensitive data redaction in logs
- ✅ **Display Security**: HTML escaping for safe content display

### Performance Features
- ✅ **Fast Build Times**: Vite for lightning-fast development and builds
- ✅ **Asset Optimization**: Optimized images and fonts
- ✅ **Bundle Analysis**: Built-in bundle size monitoring
- ✅ **Performance Monitoring**: Custom utilities for tracking performance
- ✅ **Code Splitting**: Component-based organization for optimal loading

### Development Features
- ✅ **Comprehensive Testing**: Jest with React Testing Library
- ✅ **Code Quality**: ESLint and Prettier configuration
- ✅ **Accessibility**: Accessibility testing utilities
- ✅ **Modern Architecture**: React 18 with functional components and hooks

## Technology Stack

### Core Technologies
- **React 18**: Latest React with hooks and modern patterns
- **Vite**: Fast build tool and development server
- **CSS Modules**: Component-scoped styling
- **DOMPurify**: XSS prevention and HTML sanitization

### Development Tools
- **Jest**: Testing framework with React Testing Library
- **ESLint**: Code linting with security plugins
- **Prettier**: Code formatting
- **Babel**: JSX and modern JavaScript transpilation

### Performance & Monitoring
- **Vite Bundle Analyzer**: Bundle size analysis
- **Performance Utilities**: Custom performance monitoring
- **Accessibility Testing**: Automated accessibility checks

## Installation

### Prerequisites
- Node.js (version 16 or higher)
- npm (version 8 or higher)

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd react-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Run tests**
   ```bash
   npm test
   ```

6. **Run tests with coverage**
   ```bash
   npm run test:coverage
   ```

## Project Structure

```
react-portfolio/
├── public/                 # Static assets
├── src/
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   ├── utils.js           # Utility functions
│   ├── utils/
│   │   ├── inputValidation.js  # Security utilities
│   │   ├── performance.js      # Performance utilities
│   │   └── security.js         # Additional security utilities
│   ├── components/        # React components
│   │   ├── About/         # About section
│   │   ├── Contact/       # Contact section
│   │   ├── Experience/    # Experience section
│   │   ├── Hero/          # Hero section
│   │   ├── Navbar/        # Navigation
│   │   └── Projects/      # Projects section
│   ├── data/              # Static data files
│   │   ├── history.json   # Professional history
│   │   ├── projects.json  # Project information
│   │   └── skills.json    # Skills data
│   └── __tests__/         # Test files
├── assets/                # Images and media
├── docs/                  # Documentation
├── .eslintrc.cjs          # ESLint configuration
├── .prettierrc.js         # Prettier configuration
├── babel.config.cjs       # Babel configuration
├── vite.config.js         # Vite configuration
└── package.json           # Dependencies and scripts
```

## Security Implementation

### Input Validation
The application includes comprehensive input validation:

```javascript
import { validateInput, sanitizeForDisplay, sanitizeForLogging } from './utils/inputValidation';

// Validate user input
try {
  const safeInput = validateInput(userInput);
  // Use safe input
} catch (error) {
  // Handle validation error
}

// Sanitize for display
const displayText = sanitizeForDisplay(userInput);

// Sanitize for logging (redacts sensitive data)
const logText = sanitizeForLogging(userInput);
```

### XSS Prevention
DOMPurify is integrated to prevent XSS attacks:

```javascript
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(dirtyHTML, {
  ALLOWED_TAGS: [], // No HTML tags allowed
  ALLOWED_ATTR: [], // No attributes allowed
});
```

## Performance Optimization

### Bundle Analysis
Analyze bundle size:
```bash
npm run analyze
```

### Performance Monitoring
Use built-in performance utilities:
```javascript
import { performanceMonitor } from './utils/performance';

// Measure component render time
performanceMonitor.measureRender('MyComponent', () => {
  // Component render logic
});

// Get performance metrics
const metrics = performanceMonitor.getMetrics();
```

## Testing

### Running Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm test -- --testPathPattern=inputValidation.test.js
```

### Test Coverage
The project includes comprehensive test coverage:
- **Input Validation Tests**: 24 tests covering all security scenarios
- **Component Tests**: Testing individual React components
- **Integration Tests**: End-to-end functionality testing
- **Accessibility Tests**: Ensuring accessibility compliance
- **Security Tests**: Testing security measures

### Coverage Thresholds
```json
{
  "branches": 80,
  "functions": 80,
  "lines": 80,
  "statements": 80
}
```

## Development Guidelines

### Code Quality
- All code must pass ESLint checks
- Code must be formatted with Prettier
- Security considerations must be addressed
- Performance impact must be considered

### Security Guidelines
- All user inputs must be validated
- Sensitive data must be redacted in logs
- HTML content must be sanitized before display
- No direct HTML injection allowed

### Performance Guidelines
- Use memoization for expensive calculations
- Implement lazy loading for images
- Optimize bundle size with code splitting
- Monitor performance with built-in utilities

## Deployment

### Build Process
```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

### Deployment Options
- **Netlify**: Works with drag-and-drop deployment
- **Vercel**: Optimized for Vite applications
- **GitHub Pages**: Static hosting support
- **Any Static Host**: Works with any static file hosting

### Production Considerations
- Bundle size: ~177KB JavaScript, ~14KB CSS
- Optimized assets for fast loading
- No server-side requirements
- CDN-ready asset structure

## Browser Support

- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **ES Modules**: Requires ES module support
- **CSS Variables**: Uses modern CSS features

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for your changes
5. Run the test suite
6. Submit a pull request

### Code Review Guidelines
- All code must pass ESLint and Prettier checks
- All new features must include tests
- Security considerations must be addressed
- Performance impact must be considered
- Documentation must be updated for new features

## Troubleshooting

### Common Issues

**Build Permission Errors**
```bash
chmod +x node_modules/.bin/vite
```

**Test Configuration Issues**
```bash
npm install --save-dev @babel/core @babel/preset-env babel-jest
```

**Missing CSS Modules**
```bash
# Ensure CSS files have .module.css extension
mv Contact.mocule.css Contact.module.css
```

### Performance Issues
- Use bundle analyzer to identify large dependencies
- Implement lazy loading for images
- Use memoization for expensive calculations
- Monitor performance with built-in utilities

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

For support and questions:

- Create an issue in the repository
- Check the documentation in the `docs/` folder
- Review the test files for usage examples

## Changelog

### Version 1.0.0
- Initial release with complete portfolio functionality
- Comprehensive security measures with DOMPurify
- Full test suite with 100% coverage on validation utilities
- Performance optimization with Vite
- Modern React 18 architecture

## Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## Security

This project implements comprehensive security measures including:
- Input validation and sanitization
- XSS prevention with DOMPurify
- SQL injection prevention
- Secure logging practices
- Content security policies

If you discover a security vulnerability, please report it privately to the maintainers.

## Disclaimer

This portfolio demonstrates modern React development practices and security measures. While the security implementation is robust, this should be considered a demonstration of best practices rather than a production security audit.

## Accuracy Disclaimer

The security measures and performance optimizations implemented in this project are based on current best practices. However, security and performance requirements may vary depending on your specific use case and environment. Please review and adapt the implementation to meet your specific requirements.