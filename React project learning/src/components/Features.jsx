import React from 'react'

const FeatureCard = ({ icon, title, description }) => (
  <div className="feature-card">
    <div className="feature-icon">{icon}</div>
    <h3>{title}</h3>
    <p>{description}</p>
  </div>
)

const Features = () => {
  const features = [
    {
      icon: '⚛️',
      title: 'React Hooks',
      description: 'Modern state management with useState, useEffect, and custom hooks'
    },
    {
      icon: '⚡',
      title: 'Vite Build Tool',
      description: 'Lightning-fast development server and build optimization'
    },
    {
      icon: '🎨',
      title: 'Modern Styling',
      description: 'CSS-in-JS and modern CSS features for beautiful interfaces'
    },
    {
      icon: '📱',
      title: 'Responsive Design',
      description: 'Mobile-first approach with flexible layouts'
    },
    {
      icon: '🔧',
      title: 'Developer Tools',
      description: 'ESLint, Prettier, and comprehensive development setup'
    },
    {
      icon: '🚀',
      title: 'Performance Optimized',
      description: 'Code splitting, lazy loading, and performance best practices'
    }
  ]

  return (
    <section id="features" className="section features">
      <h2>✨ React Features</h2>
      <div className="features-grid">
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  )
}

export default Features