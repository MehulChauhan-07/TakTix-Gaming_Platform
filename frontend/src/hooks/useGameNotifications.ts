import { useEffect } from "react";
import { useGameSettings } from "../contexts/GameSettingsContext";
import { toast } from "sonner";

interface GameNotification {
  title: string;
  message: string;
  type?: "success" | "error" | "warning" | "info";
}

export const useGameNotifications = () => {
  const { settings } = useGameSettings();

  useEffect(() => {
    // Request notification permission when the hook is initialized
    if (settings.notifications && "Notification" in window) {
      Notification.requestPermission().catch((error) => {
        console.error("Error requesting notification permission:", error);
      });
    }
  }, [settings.notifications]);

  const showNotification = ({
    title,
    message,
    type = "info",
  }: GameNotification) => {
    // Show toast notification
    toast[type](message, {
      description: title,
    });

    // Show browser notification if enabled
    if (
      settings.notifications &&
      "Notification" in window &&
      Notification.permission === "granted"
    ) {
      new Notification(title, {
        body: message,
        icon: "/favicon.ico",
      });
    }
  };

  const showGameStartNotification = (opponentName: string) => {
    showNotification({
      title: "Game Started",
      message: `Your game against ${opponentName} has begun!`,
      type: "success",
    });
  };

  const showGameEndNotification = (winner: string | null) => {
    showNotification({
      title: "Game Over",
      message: winner ? `${winner} wins the game!` : "It's a draw!",
      type: winner ? "success" : "info",
    });
  };

  const showTurnNotification = (isYourTurn: boolean) => {
    if (isYourTurn) {
      showNotification({
        title: "Your Turn",
        message: "It's your turn to make a move!",
        type: "info",
      });
    }
  };

  const showCheckNotification = () => {
    showNotification({
      title: "Check!",
      message: "Your king is in check!",
      type: "warning",
    });
  };

  const showGameInvitationNotification = (from: string) => {
    showNotification({
      title: "Game Invitation",
      message: `${from} has invited you to play a game!`,
      type: "info",
    });
  };

  const showConnectionErrorNotification = () => {
    showNotification({
      title: "Connection Error",
      message:
        "Lost connection to the game server. Please check your internet connection.",
      type: "error",
    });
  };

  return {
    showNotification,
    showGameStartNotification,
    showGameEndNotification,
    showTurnNotification,
    showCheckNotification,
    showGameInvitationNotification,
    showConnectionErrorNotification,
  };
};
