import { useState, useEffect, useCallback } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "../contexts/AuthContext";
import { GameService } from "../services/game.service";
import { GameState as GameStateType, GameType } from "../types/game.types";
import { useGameNotifications } from "./useGameNotifications";

interface GameState {
  isConnected: boolean;
  playerCount: number;
  isGameActive: boolean;
  currentTurn?: string;
  gameEnded?: boolean;
  winner?: string;
  matchId?: string;
  availablePlayers: Array<{ id: string; username: string }>;
}

export const useGame = (matchId?: string) => {
  const { socket } = useSocket();
  const { user } = useAuth();
  const {
    showGameStartNotification,
    showGameEndNotification,
    showConnectionErrorNotification,
  } = useGameNotifications();
  const [gameState, setGameState] = useState<GameState>({
    isConnected: false,
    playerCount: 0,
    isGameActive: false,
    availablePlayers: [],
  });
  const [game, setGame] = useState<GameStateType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Check for available players
  useEffect(() => {
    if (!socket || !user) return;

    const handleAvailablePlayers = (
      players: Array<{ id: string; username: string }>
    ) => {
      setGameState((prev) => ({ ...prev, availablePlayers: players }));

      if (players.length === 0) {
        alert(
          "No other players are online. Starting a game against the computer."
        );
        startComputerGame();
      }
    };

    socket.on("game:availablePlayers", handleAvailablePlayers);
    socket.emit("game:requestAvailablePlayers");

    return () => {
      socket.off("game:availablePlayers", handleAvailablePlayers);
    };
  }, [socket, user]);

  // Fetch game data if matchId is provided
  useEffect(() => {
    if (!matchId) return;

    const fetchGame = async () => {
      try {
        setLoading(true);
        const gameData = await GameService.getGame(matchId);
        setGame(gameData);
        setError(null);
      } catch (err) {
        setError("Failed to load game");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchGame();
  }, [matchId]);

  // Listen for game updates via socket
  useEffect(() => {
    if (!socket || !matchId) return;

    const handleConnect = () => {
      setGameState((prev) => ({ ...prev, isConnected: true }));
    };

    const handleDisconnect = () => {
      setGameState((prev) => ({ ...prev, isConnected: false }));
      showConnectionErrorNotification();
    };

    const handlePlayerCount = (count: number) => {
      setGameState((prev) => ({ ...prev, playerCount: count }));
    };

    const handleGameStart = (data: { opponent: string }) => {
      setGameState((prev) => ({ ...prev, isGameActive: true }));
      showGameStartNotification(data.opponent);
    };

    const handleTurnChange = (playerId: string) => {
      setGameState((prev) => ({ ...prev, currentTurn: playerId }));
    };

    const handleGameEnd = (winner?: string) => {
      setGameState((prev) => ({
        ...prev,
        gameEnded: true,
        winner,
        isGameActive: false,
      }));
      showGameEndNotification(winner || null);
    };

    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect);
    socket.on("game:playerCount", handlePlayerCount);
    socket.on("game:start", handleGameStart);
    socket.on("game:turnChange", handleTurnChange);
    socket.on("game:end", handleGameEnd);

    socket.emit("join-game", matchId);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect);
      socket.off("game:playerCount", handlePlayerCount);
      socket.off("game:start", handleGameStart);
      socket.off("game:turnChange", handleTurnChange);
      socket.off("game:end", handleGameEnd);
      socket.emit("leave-game", matchId);
    };
  }, [socket, matchId]);

  const startGame = useCallback(
    (opponentId: string) => {
      if (!socket || !user) return;
      socket.emit("game:start", {
        opponentId,
        userId: user._id,
      });
    },
    [socket, user]
  );

  const startComputerGame = useCallback(() => {
    if (!socket || !user) return;
    socket.emit("game:start", {
      userId: user._id,
      isComputer: true,
    });
  }, [socket, user]);

  const makeMove = useCallback(
    (move: any) => {
      if (!socket || !matchId) return;
      socket.emit("game:move", {
        matchId,
        move,
      });
    },
    [socket, matchId]
  );

  const sendChatMessage = useCallback(
    (content: string) => {
      if (!socket || !matchId || !user) return;
      socket.emit("game:chat:message", {
        matchId,
        content,
        userId: user._id,
        username: user.username,
      });
    },
    [socket, matchId, user]
  );

  // Create a new game
  const createGame = async (type: GameType, opponent: string) => {
    if (!user) {
      setError("You must be logged in to create a game");
      return null;
    }

    try {
      setLoading(true);
      const players = [
        { id: user.id, username: user.username },
        { id: opponent, username: "" }, // The opponent username would be fetched from the server
      ];

      const newGame = await GameService.createGame(type, players);
      setGame(newGame);
      return newGame;
    } catch (err) {
      setError("Failed to create game");
      console.error(err);
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    ...gameState,
    game,
    loading,
    error,
    createGame,
    startGame,
    startComputerGame,
    makeMove,
    sendChatMessage,
  };
};
