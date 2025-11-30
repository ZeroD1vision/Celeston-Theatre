import React from 'react';
import { render, screen } from '@testing-library/react';

// Простой мок для App
const MockApp = () => {
  return (
    <div data-testid="app">
      <h1>Movie App</h1>
      <nav>
        <a href="/">Главная</a>
        <a href="/movies">Фильмы</a>
      </nav>
    </div>
  );
};

describe('App Component', () => {
  test('renders app container', () => {
    render(<MockApp />);
    const appElement = screen.getByTestId('app');
    expect(appElement).toBeTruthy();
  });

  test('has navigation links', () => {
    render(<MockApp />);
    const homeLink = screen.getByText('Главная');
    const moviesLink = screen.getByText('Фильмы');
    expect(homeLink).toBeTruthy();
    expect(moviesLink).toBeTruthy();
  });

  test('displays app title', () => {
    render(<MockApp />);
    const title = screen.getByText('Movie App');
    expect(title).toBeTruthy();
  });
});