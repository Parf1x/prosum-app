// src/pages/AboutPage.test.js
import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
// import { BrowserRouter as Router } from 'react-router-dom'; 
import AboutPage from './AboutPage';

describe('AboutPage Component (No Router Test)', () => {
  test('renders the main heading "О Prosum"', () => {
    render(<AboutPage />); 
    const headingElement = screen.getByRole('heading', { name: /О Prosum/i, level: 1 });
    expect(headingElement).toBeInTheDocument();
  });

  test('renders the "Наша миссия" subheading', () => {
    render(<AboutPage />); 
    const missionHeading = screen.getByRole('heading', { name: /Наша миссия/i, level: 2 });
    expect(missionHeading).toBeInTheDocument();
  });
});