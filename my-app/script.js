// My App - JavaScript Logic

let count = 0;

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('My App loaded successfully!');
    updateCountDisplay();
});

// Interactive counter functions
function increment() {
    count++;
    updateCountDisplay();
    showMessage(`Count increased to ${count}`, 'success');
}

function decrement() {
    if (count > 0) {
        count--;
        updateCountDisplay();
        showMessage(`Count decreased to ${count}`, 'success');
    } else {
        showMessage('Cannot go below zero!', 'error');
    }
}

function reset() {
    count = 0;
    updateCountDisplay();
    showMessage('Counter reset to zero', 'success');
}

function updateCountDisplay() {
    const countElement = document.getElementById('count');
    if (countElement) {
        countElement.textContent = count;
    }
}

// Demo functionality
function showMessage(text, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;

    document.body.appendChild(messageDiv);

    // Show message
    setTimeout(() => {
        messageDiv.classList.add('show');
    }, 10);

    // Auto-remove message after 3 seconds
    setTimeout(() => {
        messageDiv.classList.remove('show');
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Additional utility functions
function showMessage() {
    showMessage('Hello! Welcome to My App!', 'success');
}

// Keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'ArrowUp':
            increment();
            break;
        case 'ArrowDown':
            decrement();
            break;
        case 'r':
        case 'R':
            reset();
            break;
        case ' ':
            e.preventDefault();
            showMessage();
            break;
    }
});

// Feature detection and enhancement
function checkBrowserFeatures() {
    const features = {
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        fetch: !!window.fetch,
        promises: !!window.Promise,
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid')
    };

    console.log('Browser Features:', features);
    
    // Add feature classes to body for CSS targeting
    const body = document.body;
    Object.keys(features).forEach(feature => {
        if (features[feature]) {
            body.classList.add(`supports-${feature}`);
        } else {
            body.classList.add(`no-${feature}`);
        }
    });

    return features;
}

// Initialize feature detection
checkBrowserFeatures();

// Accessibility enhancements
function enhanceAccessibility() {
    // Add ARIA labels to buttons
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', `Button ${index + 1}`);
        }
    });

    // Add focus indicators
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('keyboard-navigation');
        }
    });

    document.addEventListener('mousedown', () => {
        document.body.classList.remove('keyboard-navigation');
    });
}

// Initialize accessibility
enhanceAccessibility();

// Performance monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                console.log('Page Load Time:', `${perfData.loadEventEnd - perfData.loadEventStart}ms`);
                console.log('DOM Content Loaded:', `${perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart}ms`);
            }, 0);
        });
    }
}

// Initialize performance monitoring
monitorPerformance();

// Export functions for global access
window.increment = increment;
window.decrement = decrement;
window.reset = reset;
window.showMessage = showMessage;