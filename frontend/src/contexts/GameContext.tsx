import React, { createContext, useState, useContext, useEffect } from "react";
import { GameState, GameType } from "../types/game.types";
import { GameService } from "../services/game.service";
import { useSocket } from "./SocketContext";
import { useAuth } from "../hooks/useAuth";

interface GameContextType {
  activeGames: GameState[];
  completedGames: GameState[];
  loading: boolean;
  createGame: (type: GameType, opponentId: string) => Promise<GameState | null>;
  joinGame: (gameId: string) => Promise<boolean>;
  refreshGames: () => Promise<void>;
}

export const GameContext = createContext<GameContextType>({
  activeGames: [],
  completedGames: [],
  loading: false,
  createGame: async () => null,
  joinGame: async () => false,
  refreshGames: async () => {},
});

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [activeGames, setActiveGames] = useState<GameState[]>([]);
  const [completedGames, setCompletedGames] = useState<GameState[]>([]);
  const [loading, setLoading] = useState(false);
  const { socket } = useSocket();
  const { user } = useAuth();

  // Load user's games on mount
  useEffect(() => {
    if (user) {
      refreshGames();
    }
  }, [user]);

  // Listen for game updates via socket
  useEffect(() => {
    if (!socket || !user) return;

    const handleGameCreated = (game: GameState) => {
      if (game.players.some((p) => p.id === user.id)) {
        setActiveGames((prev) => [game, ...prev]);
      }
    };

    const handleGameUpdated = (game: GameState) => {
      if (game.players.some((p) => p.id === user.id)) {
        if (game.status === "completed" || game.status === "cancelled") {
          setActiveGames((prev) => prev.filter((g) => g.id !== game.id));
          setCompletedGames((prev) => [game, ...prev]);
        } else {
          setActiveGames((prev) =>
            prev.map((g) => (g.id === game.id ? game : g))
          );
        }
      }
    };

    socket.on("game:created", handleGameCreated);
    socket.on("game:updated", handleGameUpdated);

    return () => {
      socket.off("game:created", handleGameCreated);
      socket.off("game:updated", handleGameUpdated);
    };
  }, [socket, user]);

  const refreshGames = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const active = await GameService.getActiveGames(user.id);
      const completed = await GameService.getCompletedGames(user.id);

      setActiveGames(active);
      setCompletedGames(completed);
    } catch (error) {
      console.error("Failed to fetch games:", error);
    } finally {
      setLoading(false);
    }
  };

  const createGame = async (type: GameType, opponentId: string) => {
    if (!user) return null;

    try {
      setLoading(true);
      const players = [
        { id: user.id, username: user.username },
        { id: opponentId, username: "" }, // The opponent username would be fetched/updated by the server
      ];

      const newGame = await GameService.createGame(type, players);
      setActiveGames((prev) => [newGame, ...prev]);
      return newGame;
    } catch (error) {
      console.error("Failed to create game:", error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const joinGame = async (gameId: string) => {
    if (!user) return false;

    try {
      setLoading(true);
      socket?.emit("game:join", { gameId, playerId: user.id });
      return true;
    } catch (error) {
      console.error("Failed to join game:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <GameContext.Provider
      value={{
        activeGames,
        completedGames,
        loading,
        createGame,
        joinGame,
        refreshGames,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGameContext = () => useContext(GameContext);
