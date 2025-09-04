import React, { useState, useEffect, useMemo } from 'react';
import './App.css';

/**
 * Square component renders an individual cell in the tic-tac-toe board.
 * It is a simple button that displays X, O or empty and calls onClick when pressed.
 */
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square ${highlight ? 'highlight' : ''}`}
      onClick={onClick}
      aria-label={`Board square ${value ? value : 'empty'}`}
    >
      {value}
    </button>
  );
}

/**
 * Board component renders the 3x3 grid of squares.
 * It receives the current squares array, a set of winning indices to highlight,
 * and an onSquareClick callback to handle user interactions.
 */
function Board({ squares, onSquareClick, winningLine = [] }) {
  const renderSquare = (i) => {
    const isWinning = winningLine.includes(i);
    return (
      <Square
        key={i}
        value={squares[i]}
        onClick={() => onSquareClick(i)}
        highlight={isWinning}
      />
    );
  };

  return (
    <div className="ttt-board" role="grid" aria-label="Tic Tac Toe Board">
      {[0, 1, 2].map((row) => (
        <div key={row} className="ttt-row" role="row">
          {[0, 1, 2].map((col) => renderSquare(row * 3 + col))}
        </div>
      ))}
    </div>
  );
}

/**
 * Utility: calculates the winner of a tic-tac-toe board.
 * Returns an object { winner: 'X' | 'O', line: number[] } if there is a winner,
 * otherwise returns { winner: null, line: [] }.
 */
function calculateWinner(squares) {
  const lines = [
    // Rows
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    // Cols
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    // Diagonals
    [0, 4, 8], [2, 4, 6],
  ];
  for (const [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a], line: [a, b, c] };
    }
  }
  return { winner: null, line: [] };
}

// PUBLIC_INTERFACE
function App() {
  /**
   * This is a complete and interactive Tic-Tac-Toe game.
   * - Users can play by clicking cells; turns alternate between X and O.
   * - Win and draw conditions are detected and displayed.
   * - A move history is maintained, allowing time travel to prior moves.
   * - A Reset button allows starting a fresh game.
   * - A theme toggle is included (light/dark) leveraging existing CSS variables.
   */
  const [theme, setTheme] = useState('light');
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [step, setStep] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);

  // Apply theme to the root document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Derived state: current board and winner
  const currentSquares = history[step];
  const { winner, line } = useMemo(() => calculateWinner(currentSquares), [currentSquares]);

  const isBoardFull = useMemo(
    () => currentSquares.every((sq) => sq !== null),
    [currentSquares]
  );

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Handle a player's move
  const handleSquareClick = (i) => {
    // Ignore clicks if game is over or square filled
    if (winner || currentSquares[i]) return;

    const nextSquares = currentSquares.slice();
    nextSquares[i] = xIsNext ? 'X' : 'O';

    // Discard any "future" history if we are time-traveling
    const nextHistory = history.slice(0, step + 1).concat([nextSquares]);

    setHistory(nextHistory);
    setStep(nextHistory.length - 1);
    setXIsNext(!xIsNext);
  };

  // PUBLIC_INTERFACE
  const jumpTo = (moveIndex) => {
    /**
     * Jump to a specific move in history (time travel).
     * @param moveIndex number - the step index in the history to jump to
     */
    setStep(moveIndex);
    // Determine whose turn it is based on move index
    setXIsNext(moveIndex % 2 === 0);
  };

  // PUBLIC_INTERFACE
  const resetGame = () => {
    /**
     * Reset the entire game state to start fresh.
     */
    setHistory([Array(9).fill(null)]);
    setStep(0);
    setXIsNext(true);
  };

  let statusText = '';
  if (winner) {
    statusText = `Winner: ${winner}`;
  } else if (isBoardFull) {
    statusText = 'Draw: No more moves';
  } else {
    statusText = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  return (
    <div className="App">
      <header className="App-header">
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="ttt-container">
          <h1 className="ttt-title">Tic Tac Toe</h1>
          <p className="ttt-status" role="status" aria-live="polite">{statusText}</p>

          <Board
            squares={currentSquares}
            onSquareClick={handleSquareClick}
            winningLine={line}
          />

          <div className="ttt-controls">
            <button className="btn" onClick={resetGame} aria-label="Reset game">
              Reset Game
            </button>
          </div>

          <div className="ttt-history">
            <h2 className="ttt-subtitle">Move History</h2>
            <ol>
              {history.map((_, move) => {
                const description = move ? `Go to move #${move}` : 'Go to game start';
                return (
                  <li key={move}>
                    <button
                      className={`link-button ${move === step ? 'active' : ''}`}
                      onClick={() => jumpTo(move)}
                      aria-current={move === step ? 'step' : undefined}
                    >
                      {description}
                    </button>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;
