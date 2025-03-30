import { useState, useEffect } from 'react';
import { useSocket } from './useSocket';
import { useAuth } from './useAuth';
import { GameService } from '../services/game.service';
import { GameState, GameType } from '../types/game.types';

export const useGame = (gameId?: string) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const [game, setGame] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch game data if gameId is provided
  useEffect(() => {
    if (!gameId) return;

    const fetchGame = async () => {
      try {
        setLoading(true);
        const gameData = await GameService.getGame(gameId);
        setGame(gameData);
        setError(null);
      } catch (err) {
        setError('Failed to load game');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [gameId]);

  // Listen for game updates via socket
  useEffect(() => {
    if (!socket || !gameId) return;

    const handleGameUpdate = (updatedGame: GameState) => {
      if (updatedGame.id === gameId) {
        setGame(updatedGame);
      }
    };

    socket.on('game:update', handleGameUpdate);

    return () => {
      socket.off('game:update', handleGameUpdate);
    };
  }, [socket, gameId]);

  // Create a new game
  const createGame = async (type: GameType, opponent: string) => {
    if (!user) {
      setError('You must be logged in to create a game');
      return null;
    }

    try {
      setLoading(true);
      const players = [
        { id: user.id, username: user.username },
        { id: opponent, username: '' }, // The opponent username would be fetched from the server
      ];
      
      const newGame = await GameService.createGame(type, players);
      setGame(newGame);
      return newGame;
    } catch (err) {
      setError('Failed to create game');
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Make a move in the game
  const makeMove = async (move: any) => {
    if (!game || !user) {
      setError('Cannot make a move');
      return;
    }

    try {
      const updatedGame = await GameService.makeMove(game.id, user.id, move);
      setGame(updatedGame);
    } catch (err) {
      setError('Failed to make move');
      console.error(err);
    }
  };

  return {
    game,
    loading,
    error,
    createGame,
    makeMove,
  };
}; 