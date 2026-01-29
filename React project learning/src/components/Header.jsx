import React from 'react'

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="app-header">
      <div className="header-content">
        <h1>⚛️ React Project Learning</h1>
        <p className="tagline">Modern React development with Vite</p>
      </div>
      <div className="theme-toggle">
        <button 
          className="theme-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? '🌙' : '☀️'} {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>
      </div>
    </header>
  )
}

export default Header