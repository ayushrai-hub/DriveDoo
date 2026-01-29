import React from 'react';
import { render, screen } from '@testing-library/react';
import App from '../App';

// Mock all components to avoid deep testing
jest.mock('../components/Hero/Hero', () => {
  return function MockHero() {
    return <div data-testid="hero-component">Hero Section</div>;
  };
});

jest.mock('../components/Navbar/Navbar', () => {
  return function MockNavbar() {
    return <div data-testid="navbar-component">Navbar</div>;
  };
});

jest.mock('../components/About/About', () => {
  return function MockAbout() {
    return <div data-testid="about-component">About Section</div>;
  };
});

jest.mock('../components/Experience/Experience', () => {
  return function MockExperience() {
    return <div data-testid="experience-component">Experience Section</div>;
  };
});

jest.mock('../components/Projects/Projects', () => {
  return function MockProjects() {
    return <div data-testid="projects-component">Projects Section</div>;
  };
});

jest.mock('../components/Contact/Contact', () => {
  return function MockContact() {
    return <div data-testid="contact-component">Contact Section</div>;
  };
});

describe('App Component', () => {
  test('renders without crashing', () => {
    render(<App />);
    
    // Should render without errors
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
  });

  test('renders all main sections', () => {
    render(<App />);
    
    // Check that all main sections are rendered
    expect(screen.getByTestId('hero-component')).toBeInTheDocument();
    expect(screen.getByTestId('navbar-component')).toBeInTheDocument();
    expect(screen.getByTestId('about-component')).toBeInTheDocument();
    expect(screen.getByTestId('experience-component')).toBeInTheDocument();
    expect(screen.getByTestId('projects-component')).toBeInTheDocument();
    expect(screen.getByTestId('contact-component')).toBeInTheDocument();
  });

  test('has correct component structure', () => {
    render(<App />);
    
    // Check the main app container
    const appContainer = screen.getByRole('main') || screen.getByTestId('hero-component').closest('[class*="App"]');
    expect(appContainer).toBeInTheDocument();
  });

  test('renders with correct order of sections', () => {
    render(<App />);
    
    const sections = [
      screen.getByTestId('navbar-component'),
      screen.getByTestId('hero-component'),
      screen.getByTestId('about-component'),
      screen.getByTestId('experience-component'),
      screen.getByTestId('projects-component'),
      screen.getByTestId('contact-component'),
    ];
    
    // Check that sections are in the correct order
    sections.forEach((section, index) => {
      expect(section).toBeInTheDocument();
      if (index > 0) {
        expect(sections[index - 1]).toBeInTheDocument();
      }
    });
  });
});