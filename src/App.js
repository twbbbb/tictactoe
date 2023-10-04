import { useState } from "react";

function Square({ value, onSquareClick, className }) {
  return (
    <button className={className} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares,i);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = "Winner: " + squares[winner[0]];
  }else if(currentMove===9){
    status="draw";
  } 
  else {
    status = "Next player: " + (xIsNext ? "X" : "O");
  }

  const board=[];
  for(let i=0;i<3;i++){
    const tmp=[];
    for(let j=0;j<3;j++){
      let className="square";
      if(winner && winner.includes(j+i*3)){
        className+=" square-highlight";
      }
      tmp.push(<Square value={squares[j+i*3]} onSquareClick={() => handleClick(j+i*3)} className={className}/>)
    }
    board.push(
      <div className="board-row">
        {tmp}
      </div>
    )
  }
  return (
    <>
      <div className="status">{status}</div>
      {board}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];
  const [sort,setSort]=useState(true);
  const [rowCol,setRowCol]=useState([]);

  function handlePlay(nextSquares,i) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    const next=[...rowCol.slice(0,currentMove),i];
    setRowCol(next);
    setCurrentMove(nextHistory.length - 1);    
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function handleSort(){
    setSort(!sort);
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      const i=rowCol[move-1];
      description = "Go to move #" + move+" ("+parseInt(i/3)+","+i%3+")";
    } else {
      description = "Go to game start (row, col)";
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });

  if(!sort){
    moves.reverse();
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}/>
      </div>
      <div className="game-info">
        <button onClick={handleSort}>sort</button>
        <ol>{moves}</ol>
      </div>
      <div>{"You are at move #"+currentMove}</div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {

      return lines[i];
    }
  }
  return null;
}
