import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders tic tac toe UI and allows a move', () => {
  render(<App />);
  expect(screen.getByText(/Tic Tac Toe/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Reset game/i })).toBeInTheDocument();

  // Click a square and expect "X" to appear and turn to switch
  const squares = screen.getAllByRole('button', { name: /Board square/i });
  fireEvent.click(squares[0]);
  expect(squares[0].textContent).toBe('X');
});
