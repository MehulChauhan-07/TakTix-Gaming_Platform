import React from 'react';
import { Button } from '@components/ui/button';

interface BoardProps {
  board: (string | null)[];
  onCellClick: (position: number) => void;
  currentPlayer: string;
  disabled?: boolean;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onCellClick,
  currentPlayer,
  disabled = false,
}) => {
  return (
    <div className="grid grid-cols-3 gap-4 w-full max-w-md mx-auto">
      {board.map((cell, index) => (
        <Button
          key={index}
          variant="outline"
          className="aspect-square text-4xl font-bold"
          onClick={() => onCellClick(index)}
          disabled={disabled || cell !== null}
        >
          {cell}
        </Button>
      ))}
    </div>
  );
}; 