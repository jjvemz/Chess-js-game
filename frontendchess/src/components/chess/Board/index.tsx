import React, { useEffect, useState } from 'react';
import BoardSquare from '../BoardSquare';

interface BoardProps {
  board: any[][]; // Replace `any` with the specific type of your board elements if known
  turn: 'w' | 'b';
}

interface Position {
  x: number;
  y: number;
}

const Board: React.FC<BoardProps> = ({ board, turn }) => {
  const [currBoard, setCurrBoard] = useState<any[]>([]);  

  useEffect(() => {
    setCurrBoard(turn === 'w' ? board.flat() : board.flat().reverse());
  }, [board, turn]);

  function getXYPosition(i: number): Position {
    const x = turn === 'w' ? i % 8 : Math.abs((i % 8) - 7);
    const y = turn === 'w' ? Math.abs(Math.floor(i / 8) - 7) : Math.floor(i / 8);
    return { x, y };
  }

  function isBlack(i: number): boolean {
    const { x, y } = getXYPosition(i);
    return (x + y) % 2 === 1;
  }

  function getPosition(i: number): string {
    const { x, y } = getXYPosition(i);
    const letter = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'][x];
    return `${letter}${y + 1}`;
  }

  return (
    <div className="board">
      {currBoard.map((piece, i) => (
        <div key={i} className="square">
          <BoardSquare
            piece={piece}
            black={isBlack(i)}
            position={getPosition(i)}
          />
        </div>
      ))}
    </div>
  );
};

export default Board;