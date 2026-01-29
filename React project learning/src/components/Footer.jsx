import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <p>&copy; {currentYear} React Project Learning. Built with React and Vite.</p>
        <div className="footer-links">
          <a href="#" onClick={(e) => {
            e.preventDefault()
            alert('This would link to GitHub in a real project!')
          }}>
            GitHub
          </a>
          <a href="#" onClick={(e) => {
            e.preventDefault()
            alert('This would link to Documentation in a real project!')
          }}>
            Documentation
          </a>
          <a href="#" onClick={(e) => {
            e.preventDefault()
            alert('This would link to Contact in a real project!')
          }}>
            Contact
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer