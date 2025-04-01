import React from "react";
import { useOnlineUsers } from "../../contexts/OnlineUsersContext";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";

interface OnlinePlayersProps {
  onStartGame: (opponentId: string) => void;
  onStartComputerGame: () => void;
  currentUserId: string;
}

export const OnlinePlayers: React.FC<OnlinePlayersProps> = ({
  onStartGame,
  onStartComputerGame,
  currentUserId,
}) => {
  const { onlineUsers, loading } = useOnlineUsers();

  // Filter out current user from online users
  const availablePlayers = onlineUsers.filter(
    (user) => user._id !== currentUserId
  );

  if (loading) {
    return <div>Loading online players...</div>;
  }

  return (
    <Card className="p-4">
      <h3 className="text-lg font-semibold mb-4">Online Players</h3>

      {availablePlayers.length === 0 ? (
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              No other players are online at the moment.
            </AlertDescription>
          </Alert>
          <Button onClick={onStartComputerGame} className="w-full">
            Play Against Computer
          </Button>
        </div>
      ) : (
        <div className="space-y-2">
          {availablePlayers.map((player) => (
            <div
              key={player._id}
              className="flex items-center justify-between p-2 border rounded"
            >
              <div className="flex items-center space-x-2">
                {player.profilePicture && (
                  <img
                    src={player.profilePicture}
                    alt={player.username}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span>{player.username}</span>
                <span className="text-sm text-muted-foreground">
                  Rating: {player.stats.rating}
                </span>
              </div>
              <Button
                onClick={() => onStartGame(player._id)}
                variant="outline"
                size="sm"
              >
                Challenge
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
