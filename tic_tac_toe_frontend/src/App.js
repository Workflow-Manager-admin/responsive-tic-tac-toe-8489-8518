import React, { useState, useEffect } from "react";
import "./App.css";

// =====================================
// PUBLIC_INTERFACE
/**
 * Responsive, minimal modern Tic Tac Toe game for two players (X and O).
 * Features:
 * - Interactive 3x3 board
 * - Player turn indicator
 * - Winner/tie detection and board highlight
 * - Reset button
 * - Fully responsive, minimal and modern UI
 */
function App() {
  // Track board state as array of 9 elements ('' | 'X' | 'O')
  const [board, setBoard] = useState(Array(9).fill(""));
  // X goes first (true = X's turn, false = O's turn)
  const [isXNext, setIsXNext] = useState(true);
  // Winner ('X' | 'O' | null)
  const [winner, setWinner] = useState(null);
  // Array of indexes that make up the winning line, if any
  const [winningLine, setWinningLine] = useState([]);
  // Show tie state
  const [isTie, setIsTie] = useState(false);
  // For accessibility: last move for focus ring
  const [lastMove, setLastMove] = useState(null);
  // Theme (light only for now, but CSS supports both)
  const [theme, setTheme] = useState('light');

  // Use effect to update document theme in sync with context
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  // Handle clicking a square
  function handleSquareClick(idx) {
    if (board[idx] !== "" || winner) return; // Don't overwrite or play after over
    const nextBoard = board.slice();
    nextBoard[idx] = isXNext ? "X" : "O";
    setBoard(nextBoard);
    setIsXNext(!isXNext);
    setLastMove(idx);

    const res = calculateWinner(nextBoard);

    if (res.winner) {
      setWinner(res.winner);
      setWinningLine(res.line);
      setIsTie(false);
    } else if (nextBoard.every((cell) => cell !== "")) {
      setIsTie(true);
      setWinner(null);
    } else {
      setWinner(null);
      setWinningLine([]);
      setIsTie(false);
    }
  }

  // PUBLIC_INTERFACE
  // Reset for new game
  function handleReset() {
    setBoard(Array(9).fill(""));
    setIsXNext(true);
    setWinner(null);
    setWinningLine([]);
    setIsTie(false);
    setLastMove(null);
  }

  // PUBLIC_INTERFACE
  // Winner calculation for Tic Tac Toe: returns {winner:'X'|'O'|null, line:[indexes]|[]}
  function calculateWinner(squares) {
    // All winning lines
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        return { winner: squares[a], line };
      }
    }
    return { winner: null, line: [] };
  }

  // PUBLIC_INTERFACE
  // Theme toggle (bonus: keyboard and button support)
  function toggleTheme() {
    setTheme(theme === "light" ? "dark" : "light");
  }

  // Create board rows (3x3) for rendering
  function renderBoard() {
    let rows = [];
    for (let r = 0; r < 3; r++) {
      let cells = [];
      for (let c = 0; c < 3; c++) {
        let idx = r * 3 + c;
        let isWinningSquare = winningLine.includes(idx);
        let isRecent = lastMove === idx;
        cells.push(
          <button
            key={idx}
            className={`ttt-square${isWinningSquare ? " winner" : ""}${isRecent ? " last-move" : ""}`}
            onClick={() => handleSquareClick(idx)}
            aria-label={`Place ${isXNext && !winner && !isTie ? 'X' : 'O'} in cell ${r + 1},${c + 1}${board[idx] ? ': already occupied by ' + board[idx] : ''}`}
            disabled={!!board[idx] || !!winner || isTie}
            tabIndex={0}
          >
            {board[idx]}
          </button>
        );
      }
      rows.push(
        <div className="ttt-row" key={r}>
          {cells}
        </div>
      );
    }
    return rows;
  }

  // Determine status message for header area
  let statusMsg = "";
  if (winner) {
    statusMsg = `Winner: ${winner}`;
  } else if (isTie) {
    statusMsg = "It's a tie!";
  } else {
    statusMsg = `Next: ${isXNext ? "X" : "O"}`;
  }

  // Render minimal Tic Tac Toe Game
  return (
    <div className="App">
      <header className="tic-header">
        <h1 className="tic-title">Tic Tac Toe</h1>
        <button
          className="theme-toggle"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
        >
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>
      <main className="tic-content">
        <div className="status-bar">
          <span
            className={`player-indicator ${winner ? 'winner' : isTie ? 'tie' : ''} ${isXNext && !winner && !isTie ? 'x-turn' : ''}`} // Add classes for style
            aria-live="polite"
          >
            {statusMsg}
          </span>
        </div>
        <section className="ttt-board-container">
          <div className="ttt-board">
            {renderBoard()}
          </div>
        </section>
        <button
          className="btn-reset"
          onClick={handleReset}
          aria-label="Reset game"
          tabIndex={0}
        >
          Reset
        </button>
        <footer className="tic-footer">
          <span className="tic-footer-txt">
            Two-player mode &middot; Modern minimal UI &middot; KAVIA demo
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
