import React from 'react'

const Hero = () => {
  return (
    <section id="home" className="section hero">
      <div className="hero-content">
        <h2>Welcome to React Development</h2>
        <p className="hero-subtitle">
          This project demonstrates modern React patterns with hooks, 
          component composition, and state management.
        </p>
        <div className="hero-buttons">
          <button className="btn btn-primary" onClick={() => {
            const demo = document.getElementById('demo')
            if (demo) demo.scrollIntoView({ behavior: 'smooth' })
          }}>
            Explore Demo
          </button>
          <button className="btn btn-secondary" onClick={() => {
            const features = document.getElementById('features')
            if (features) features.scrollIntoView({ behavior: 'smooth' })
          }}>
            See Features
          </button>
        </div>
      </div>
    </section>
  )
}

export default Hero