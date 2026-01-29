// New Code Project - JavaScript Logic

// Application state
const state = {
    progress: 0,
    theme: 'light'
};

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    console.log('🚀 New Code Project loaded successfully!');
    init();
});

function init() {
    bindEvents();
    initScrollProgress();
    checkTheme();
    updateProgressDisplay();
    console.log('Application initialized with features:', getBrowserFeatures());
}

function bindEvents() {
    // Navigation smooth scrolling
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Update active nav link
            document.querySelectorAll('.nav-link').forEach(nav => nav.classList.remove('active'));
            link.classList.add('active');
            
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Demo interactions
    document.getElementById('colorPicker')?.addEventListener('input', (e) => {
        updateColorPreview(e.target.value);
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', handleKeyboardShortcuts);

    // Theme toggle (if implemented)
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
}

// Demo Functions
function startDemo() {
    showMessage('Demo started! Try the interactive features below.', 'success');
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
}

function showFeatures() {
    showMessage('Check out our amazing features!', 'success');
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
}

function applyColor() {
    const color = document.getElementById('colorPicker')?.value || '#667eea';
    document.documentElement.style.setProperty('--primary-color', color);
    document.documentElement.style.setProperty('--secondary-color', adjustColor(color, -20));
    showMessage(`Color applied: ${color}`, 'success');
}

function resetColor() {
    document.documentElement.style.removeProperty('--primary-color');
    document.documentElement.style.removeProperty('--secondary-color');
    document.getElementById('colorPicker').value = '#667eea';
    updateColorPreview('#667eea');
    showMessage('Color reset to default', 'info');
}

function updateColorPreview(color) {
    const preview = document.getElementById('colorPreview');
    if (preview) {
        preview.style.backgroundColor = color;
        preview.style.borderColor = adjustColor(color, -30);
        preview.textContent = `Selected Color: ${color.toUpperCase()}`;
    }
}

function generateText() {
    const input = document.getElementById('textInput');
    const output = document.getElementById('textOutput');
    
    if (input && output) {
        const text = input.value.trim();
        if (text) {
            const generated = generateCreativeText(text);
            output.textContent = generated;
            showMessage('Text generated successfully!', 'success');
        } else {
            showMessage('Please enter some text first', 'error');
        }
    }
}

function clearText() {
    const input = document.getElementById('textInput');
    const output = document.getElementById('textOutput');
    
    if (input) input.value = '';
    if (output) output.textContent = 'Your generated text will appear here...';
    showMessage('Text cleared', 'info');
}

function incrementProgress() {
    if (state.progress < 100) {
        state.progress += 10;
        updateProgressDisplay();
        showMessage(`Progress increased to ${state.progress}%`, 'success');
    } else {
        showMessage('Progress already at maximum!', 'info');
    }
}

function decrementProgress() {
    if (state.progress > 0) {
        state.progress -= 10;
        updateProgressDisplay();
        showMessage(`Progress decreased to ${state.progress}%`, 'info');
    } else {
        showMessage('Progress already at minimum!', 'info');
    }
}

function resetProgress() {
    state.progress = 0;
    updateProgressDisplay();
    showMessage('Progress reset to 0%', 'info');
}

function updateProgressDisplay() {
    const fill = document.getElementById('progressFill');
    const text = document.getElementById('progressText');
    
    if (fill) fill.style.width = `${state.progress}%`;
    if (text) text.textContent = `${state.progress}%`;
}

// Utility Functions
function generateCreativeText(input) {
    const templates = [
        `✨ Your input: "${input}" is awesome!`,
        `🚀 "${input}" - A great choice for innovation!`,
        `💡 "${input}" sparks creativity and inspiration!`,
        `🎯 "${input}" - Precisely what we needed!`,
        `🔥 "${input}" is on fire with potential!`
    ];
    
    const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
    return randomTemplate;
}

function adjustColor(color, amount) {
    return color; // Simplified for now
}

function handleKeyboardShortcuts(e) {
    // Ctrl/Cmd + K: Focus on text input
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const input = document.getElementById('textInput');
        if (input) input.focus();
    }
    
    // Ctrl/Cmd + G: Generate text
    if ((e.ctrlKey || e.metaKey) && e.key === 'g') {
        e.preventDefault();
        generateText();
    }
    
    // Ctrl/Cmd + P: Toggle progress
    if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
        e.preventDefault();
        incrementProgress();
    }
    
    // Ctrl/Cmd + R: Reset progress
    if ((e.ctrlKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        resetProgress();
    }
}

// Theme Management
function toggleTheme() {
    state.theme = state.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', state.theme);
    localStorage.setItem('theme', state.theme);
    showMessage(`Switched to ${state.theme} theme`, 'success');
}

function checkTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    state.theme = savedTheme;
    document.documentElement.setAttribute('data-theme', state.theme);
}

// Scroll Progress
function initScrollProgress() {
    const progress = document.createElement('div');
    progress.className = 'scroll-progress';
    document.body.appendChild(progress);
    
    window.addEventListener('scroll', () => {
        const scrolled = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
        progress.style.width = `${scrolled}%`;
    });
}

// Browser Features Detection
function getBrowserFeatures() {
    return {
        localStorage: !!window.localStorage,
        sessionStorage: !!window.sessionStorage,
        fetch: !!window.fetch,
        promises: !!window.Promise,
        flexbox: CSS.supports('display', 'flex'),
        grid: CSS.supports('display', 'grid'),
        cssVariables: CSS.supports('--fake-var', '0'),
        animations: CSS.supports('animation', 'none'),
        transitions: CSS.supports('transition', 'none')
    };
}

// Performance Monitoring
function monitorPerformance() {
    if ('performance' in window) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                const perfData = performance.getEntriesByType('navigation')[0];
                const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
                const domContentLoaded = perfData.domContentLoadedEventEnd - perfData.domContentLoadedEventStart;
                
                console.log('📊 Performance Metrics:');
                console.log(`   Page Load Time: ${loadTime.toFixed(2)}ms`);
                console.log(`   DOM Content Loaded: ${domContentLoaded.toFixed(2)}ms`);
                
                // Log if performance is poor
                if (loadTime > 3000) {
                    console.warn('⚠️  Slow loading detected. Consider optimization.');
                }
            }, 0);
        });
    }
}

// Accessibility Enhancements
function enhanceAccessibility() {
    // Add ARIA labels
    const buttons = document.querySelectorAll('button');
    buttons.forEach((button, index) => {
        if (!button.getAttribute('aria-label')) {
            button.setAttribute('aria-label', `Button ${index + 1}`);
        }
    });

    // Keyboard navigation for demo panels
    const panels = document.querySelectorAll('.demo-panel');
    panels.forEach(panel => {
        panel.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const firstButton = panel.querySelector('button');
                if (firstButton) firstButton.click();
            }
        });
    });
}

// Message System
function showMessage(text, type = 'success') {
    // Remove existing messages
    const existingMessage = document.querySelector('.toast-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const message = document.createElement('div');
    message.className = `toast-message ${type}`;
    message.textContent = text;

    document.body.appendChild(message);

    // Trigger animation
    setTimeout(() => message.classList.add('show'), 10);

    // Auto-remove after 3 seconds
    setTimeout(() => {
        message.classList.remove('show');
        setTimeout(() => message.remove(), 300);
    }, 3000);
}

// Export functions for global access
window.startDemo = startDemo;
window.showFeatures = showFeatures;
window.applyColor = applyColor;
window.resetColor = resetColor;
window.generateText = generateText;
window.clearText = clearText;
window.incrementProgress = incrementProgress;
window.decrementProgress = decrementProgress;
window.resetProgress = resetProgress;
window.toggleTheme = toggleTheme;

// Initialize additional features
enhanceAccessibility();
monitorPerformance();

console.log('🎉 All features loaded and ready!');