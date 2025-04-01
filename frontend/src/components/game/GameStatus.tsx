import React from "react";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle, AlertTriangle, CheckCircle2 } from "lucide-react";

interface GameStatusProps {
  isConnected: boolean;
  playerCount: number;
  isGameActive: boolean;
  currentTurn?: string;
  gameEnded?: boolean;
  winner?: string;
}

export const GameStatus: React.FC<GameStatusProps> = ({
  isConnected,
  playerCount,
  isGameActive,
  currentTurn,
  gameEnded,
  winner,
}) => {
  if (!isConnected) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Disconnected from game server. Please refresh the page.
        </AlertDescription>
      </Alert>
    );
  }

  if (playerCount < 2) {
    return (
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Waiting for another player to join the game...
        </AlertDescription>
      </Alert>
    );
  }

  if (gameEnded) {
    return (
      <Alert variant={winner ? "default" : null}>
        <CheckCircle2 className="h-4 w-4" />
        <AlertDescription>
          {winner ? `Game Over! ${winner} wins!` : "Game Over! It's a draw!"}
        </AlertDescription>
      </Alert>
    );
  }

  if (isGameActive && currentTurn) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>{currentTurn}'s turn</AlertDescription>
      </Alert>
    );
  }

  return null;
};
