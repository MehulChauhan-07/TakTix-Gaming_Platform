import React, { useState, useEffect } from 'react';
import { Board } from './Board';
import { useSocket } from '@hooks/useSocket';
import { useAuth } from '@hooks/use-auth';
import { Card } from '@components/ui/card';
import { Button } from '@components/ui/button';

interface GameProps {
  gameId: string;
  initialBoard: (string | null)[];
  players: { id: string; username: string }[];
  currentTurn: string;
}

export const Game: React.FC<GameProps> = ({
  gameId,
  initialBoard,
  players,
  currentTurn,
}) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [board, setBoard] = useState(initialBoard);
  const [isMyTurn, setIsMyTurn] = useState(currentTurn === user?.id);
  const [gameStatus, setGameStatus] = useState<'waiting' | 'in_progress' | 'completed'>('in_progress');

  useEffect(() => {
    if (!socket) return;

    socket.on('game:move', ({ board: newBoard, currentTurn: newTurn, winner }) => {
      setBoard(newBoard);
      setIsMyTurn(newTurn === user?.id);
      
      if (winner) {
        setGameStatus('completed');
      }
    });

    return () => {
      socket.off('game:move');
    };
  }, [socket, user?.id]);

  const handleCellClick = (position: number) => {
    if (!isMyTurn || gameStatus !== 'in_progress') return;

    socket?.emit('game:move', {
      gameId,
      position,
      playerId: user?.id,
    });
  };

  const getGameStatusMessage = () => {
    if (gameStatus === 'completed') {
      const winner = players.find(p => p.id === board[4]);
      return winner ? `${winner.username} wins!` : "It's a draw!";
    }
    return isMyTurn ? "Your turn" : `${players.find(p => p.id === currentTurn)?.username}'s turn`;
  };

  return (
    <Card className="p-6 max-w-2xl mx-auto">
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <div className="text-lg font-semibold">
            {players[0].username} vs {players[1].username}
          </div>
          <div className="text-sm text-muted-foreground">
            {getGameStatusMessage()}
          </div>
        </div>

        <Board
          board={board}
          onCellClick={handleCellClick}
          currentPlayer={currentTurn}
          disabled={!isMyTurn || gameStatus === 'completed'}
        />

        {gameStatus === 'completed' && (
          <div className="flex justify-center">
            <Button
              variant="outline"
              onClick={() => {
                // Handle game restart or navigation
                window.location.href = '/games';
              }}
            >
              Back to Games
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}; 