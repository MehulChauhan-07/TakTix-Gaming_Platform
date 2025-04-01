import React from "react";
import { useSocket } from "../../hooks/useSocket";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { useGameNotifications } from "../../hooks/useGameNotifications";

interface GameInvitationProps {
  onAccept: (matchId: string) => void;
  onDecline: (matchId: string) => void;
}

interface Invitation {
  matchId: string;
  from: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  gameType: string;
  timestamp: Date;
}

export const GameInvitation: React.FC<GameInvitationProps> = ({
  onAccept,
  onDecline,
}) => {
  const [invitations, setInvitations] = React.useState<Invitation[]>([]);
  const { socket } = useSocket();
  const { showGameInvitationNotification } = useGameNotifications();

  React.useEffect(() => {
    if (!socket) return;

    const handleNewInvitation = (invitation: Invitation) => {
      setInvitations((prev) => [...prev, invitation]);
      showGameInvitationNotification(invitation.from.username);
    };

    const handleInvitationExpired = (matchId: string) => {
      setInvitations((prev) => prev.filter((inv) => inv.matchId !== matchId));
    };

    const handleAvailablePlayers = (
      players: Array<{ id: string; username: string }>
    ) => {
      if (players.length === 0) {
        // No players available, show computer game option
        const computerInvitation: Invitation = {
          matchId: "computer-game",
          from: {
            _id: "computer",
            username: "Computer",
            profilePicture: "/images/computer-avatar.png",
          },
          gameType: "Tic-tac-toe",
          timestamp: new Date(),
        };
        setInvitations((prev) => [...prev, computerInvitation]);
      }
    };

    socket.on("game:invitation", handleNewInvitation);
    socket.on("game:invitation:expired", handleInvitationExpired);
    socket.on("game:availablePlayers", handleAvailablePlayers);

    // Request available players when component mounts
    socket.emit("game:requestAvailablePlayers");

    return () => {
      socket.off("game:invitation", handleNewInvitation);
      socket.off("game:invitation:expired", handleInvitationExpired);
      socket.off("game:availablePlayers", handleAvailablePlayers);
    };
  }, [socket]);

  const handleAccept = (invitation: Invitation) => {
    if (invitation.matchId === "computer-game") {
      // Handle computer game acceptance
      onAccept("computer-game");
    } else {
      onAccept(invitation.matchId);
    }
  };

  if (invitations.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 space-y-2 z-50">
      {invitations.map((invitation) => (
        <Card key={invitation.matchId} className="p-4 w-80">
          <div className="flex items-center space-x-2 mb-2">
            {invitation.from.profilePicture && (
              <img
                src={invitation.from.profilePicture}
                alt={invitation.from.username}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-semibold">{invitation.from.username}</span>
            <span className="text-sm text-muted-foreground">
              {invitation.matchId === "computer-game"
                ? "Computer is available to play"
                : `invites you to play ${invitation.gameType}`}
            </span>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => handleAccept(invitation)} className="flex-1">
              Accept
            </Button>
            <Button
              onClick={() => onDecline(invitation.matchId)}
              variant="outline"
              className="flex-1"
            >
              Decline
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
