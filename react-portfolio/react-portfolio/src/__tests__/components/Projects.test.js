import React from 'react';
import { render, screen } from '@testing-library/react';
import Projects from '../../components/Projects/Projects';

// Mock the data files
jest.mock('../../data/projects.json', () => [
  {
    title: 'Project A',
    imageSrc: 'projects/project.png',
    description: 'This is a project made to learn the latest languages by building an app.',
    skills: ['React', 'Express', 'Node'],
    demo: 'https://www.example.com',
    source: 'https://www.github.com'
  },
  {
    title: 'Project B',
    imageSrc: 'projects/project.png',
    description: 'This is a project made to learn the latest languages by building an app.',
    skills: ['React', 'Express', 'Node', 'Sass'],
    demo: 'https://www.example.com',
    source: 'https://www.github.com'
  }
]);

// Mock the getImageUrl utility
jest.mock('../../utils', () => ({
  getImageUrl: jest.fn((path) => `/assets/${path}`),
}));

describe('Projects Component', () => {
  test('renders projects section with heading', () => {
    render(<Projects />);
    
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    expect(screen.getByText('Projects')).toBeInTheDocument();
  });

  test('renders project cards', () => {
    render(<Projects />);
    
    // Should render project cards based on the mock data
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
  });

  test('renders project descriptions', () => {
    render(<Projects />);
    
    expect(screen.getByText(/This is a project made to learn the latest languages/)).toBeInTheDocument();
  });

  test('renders project skills', () => {
    render(<Projects />);
    
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Express')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  test('renders project links', () => {
    render(<Projects />);
    
    const demoLinks = screen.getAllByRole('link', { name: /demo/i });
    const sourceLinks = screen.getAllByRole('link', { name: /source/i });
    
    expect(demoLinks.length).toBeGreaterThan(0);
    expect(sourceLinks.length).toBeGreaterThan(0);
  });

  test('project cards have proper structure', () => {
    render(<Projects />);
    
    // Check that project cards contain expected elements
    expect(screen.getByText('Project A')).toBeInTheDocument();
    expect(screen.getByText('Project B')).toBeInTheDocument();
    
    // Check for skills display
    expect(screen.getByText('React')).toBeInTheDocument();
  });

  test('projects section has proper semantic structure', () => {
    render(<Projects />);
    
    const section = screen.getByRole('region') || screen.getByTestId('projects-section') || screen.getByText('Projects').closest('section');
    expect(section).toBeInTheDocument();
    
    // Check for proper heading
    const heading = screen.getByRole('heading', { level: 2 });
    expect(heading).toBeInTheDocument();
    expect(heading).toHaveTextContent('Projects');
  });

  test('project images are rendered', () => {
    const { getImageUrl } = require('../../utils');
    getImageUrl.mockReturnValue('/assets/projects/project.png');
    
    render(<Projects />);
    
    // Should render project images (though they're mocked)
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });

  test('project skills are properly displayed', () => {
    render(<Projects />);
    
    // Check that skills are displayed for projects
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('Express')).toBeInTheDocument();
    expect(screen.getByText('Node')).toBeInTheDocument();
  });

  test('project links are accessible', () => {
    render(<Projects />);
    
    const demoLinks = screen.getAllByRole('link', { name: /demo/i });
    const sourceLinks = screen.getAllByRole('link', { name: /source/i });
    
    demoLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
    
    sourceLinks.forEach(link => {
      expect(link).toHaveAttribute('href');
      expect(link).toHaveAttribute('target', '_blank');
      expect(link).toHaveAttribute('rel', 'noopener noreferrer');
    });
  });
});