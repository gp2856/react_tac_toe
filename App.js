import { useState } from 'react';
function Square({value, onSquareClick}) {
  return (
   <button className="square" onClick= { onSquareClick }>{value}</button>
  );
}

  const MAX_ROWS = 6 ;
  const MAX_COLS = 6;
export default function Game() {
        // Define the history based on the number of rows and columns
        const [history, setHistory] = useState([Array(MAX_ROWS * MAX_COLS).fill(null)]);
        const [currentMove, setCurrentMove] = useState(0);
        const currentSquares = history[currentMove];
        const xIsNext = currentMove % 2 === 0;

      function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
      }

      function jumpTo(nextMove) {
        setCurrentMove(nextMove);
      }

      const moves = history.map((squares, move) => {
        let description;
        if (move > 0) {
          description = 'Go to move #' + move;
        } else {
          description = 'Go to game start';
        }
        return (
          <li key={move}>
            <button onClick={() => jumpTo(move)}>{description}</button>
          </li>
        );
      });

    return (
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay}/>
        </div>
        <div className="game-info">
          <div>
            <ol>{moves}</ol>
          </div>
        </div>
      </div>
    );
  }

function Board({ xIsNext, squares, onPlay }) {

  function handleClick(i) {
    if (calculateWinner(squares, MAX_ROWS) || squares[i]) {
      return;
    }
  const nextSquares = squares.slice();
  if (xIsNext) {
    nextSquares[i] = 'X';
  } else {
    nextSquares[i] = 'O';
  }
  onPlay(nextSquares);
}
  const winner = calculateWinner(squares, MAX_ROWS);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  // Dynamically render the squares, allowing for a configurable number
  // of rows and columns.
  const boardRows = [];
  for (let row = 0; row < MAX_ROWS; row++) {
    const boardRow = [];
    for (let col = 0; col < MAX_COLS; col++) {
      const i = row * MAX_COLS + col;
      boardRow.push(
        <Square
          key={i}
          value={squares[i]}
          onSquareClick={() => handleClick(i)}
        />
      );
    }
    boardRows.push(
      <div className="board-row">{boardRow}</div>
    );
  }
 return (
    <>
      <div className="status">{status}</div>
      {boardRows}   
    </>
  );
} 

function calculateWinner(squares, size) {
  const lines = [];

  // Rows
  for (let row = 0; row < size; row++) {
    const rowIndices = [];
    for (let col = 0; col < size; col++) {
      rowIndices.push(row * size + col);
    }
    lines.push(rowIndices);
  }

  // Columns
  for (let col = 0; col < size; col++) {
    const colIndices = [];
    for (let row = 0; row < size; row++) {
      colIndices.push(row * size + col);
    }
    lines.push(colIndices);
  }

  // Main diagonal
  const mainDiagonal = [];
  for (let i = 0; i < size; i++) {
    mainDiagonal.push(i * size + i);
  }
  lines.push(mainDiagonal);

  // Anti-diagonal
  const antiDiagonal = [];
  for (let i = 0; i < size; i++) {
    antiDiagonal.push(i * size + (size - 1 - i));
  }
  lines.push(antiDiagonal);

  // Check for a winner
  for (let i = 0; i < lines.length; i++) {
    const [a, ...rest] = lines[i];
    if (squares[a] && rest.every(index => squares[index] === squares[a])) {
      return squares[a];
    }
  }

  return null;
}


  
