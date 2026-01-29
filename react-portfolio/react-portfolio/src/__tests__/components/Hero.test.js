import React from 'react';
import { render, screen } from '@testing-library/react';
import Hero from '../../components/Hero/Hero';

// Mock the getImageUrl utility
jest.mock('../../utils', () => ({
  getImageUrl: jest.fn((path) => `/assets/${path}`),
}));

describe('Hero Component', () => {
  test('renders hero section with proper heading', () => {
    render(<Hero />);
    
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
    expect(screen.getByText('Hi, I\'m Ada')).toBeInTheDocument();
  });

  test('renders hero description', () => {
    render(<Hero />);
    
    expect(screen.getByText(/I'm a full-stack developer with 5 years of experience/)).toBeInTheDocument();
  });

  test('renders contact button with proper attributes', () => {
    render(<Hero />);
    
    const contactButton = screen.getByRole('link', { name: /contact me/i });
    expect(contactButton).toBeInTheDocument();
    expect(contactButton).toHaveAttribute('href', 'mailto:myemail@email.com');
  });

  test('renders hero image with proper alt text', () => {
    render(<Hero />);
    
    const heroImage = screen.getByRole('img', { name: /hero image of me/i });
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute('alt', 'Hero image of me');
  });

  test('hero section has proper semantic structure', () => {
    render(<Hero />);
    
    const section = screen.getByRole('banner') || screen.getByTestId('hero-section') || screen.getByText('Hi, I\'m Ada').closest('section');
    expect(section).toBeInTheDocument();
    
    // Check for proper heading hierarchy
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toBeInTheDocument();
  });

  test('contact button is accessible', () => {
    render(<Hero />);
    
    const contactButton = screen.getByRole('link', { name: /contact me/i });
    expect(contactButton).toBeInTheDocument();
    expect(contactButton).toBeEnabled();
    expect(contactButton).toHaveAttribute('href', 'mailto:myemail@email.com');
  });

  test('hero content is properly structured', () => {
    render(<Hero />);
    
    const title = screen.getByText('Hi, I\'m Ada');
    const description = screen.getByText(/I'm a full-stack developer with 5 years of experience/);
    const contactButton = screen.getByRole('link', { name: /contact me/i });
    const heroImage = screen.getByRole('img', { name: /hero image of me/i });
    
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
    expect(heroImage).toBeInTheDocument();
  });

  test('hero section contains all expected elements', () => {
    render(<Hero />);
    
    // Check that all main elements are present
    expect(screen.getByText('Hi, I\'m Ada')).toBeInTheDocument();
    expect(screen.getByText(/Reach out if you'd like to learn more!/)).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /contact me/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /hero image of me/i })).toBeInTheDocument();
  });

  test('hero image has proper src attribute', () => {
    const { getImageUrl } = require('../../utils');
    getImageUrl.mockReturnValue('/assets/hero/heroImage.png');
    
    render(<Hero />);
    
    const heroImage = screen.getByRole('img', { name: /hero image of me/i });
    expect(heroImage).toHaveAttribute('src', '/assets/hero/heroImage.png');
  });

  test('hero section is visually appealing and accessible', () => {
    render(<Hero />);
    
    // Test that the hero section has the expected content
    const title = screen.getByText('Hi, I\'m Ada');
    const description = screen.getByText(/full-stack developer/);
    const contactButton = screen.getByRole('link', { name: /contact me/i });
    
    // Verify the content is present and accessible
    expect(title).toBeInTheDocument();
    expect(description).toBeInTheDocument();
    expect(contactButton).toBeInTheDocument();
    
    // Check that the button is actionable
    expect(contactButton).toHaveAttribute('href');
    expect(contactButton.getAttribute('href')).toMatch(/^mailto:/);
  });
});