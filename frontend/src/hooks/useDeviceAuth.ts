import { useEffect } from "react";
import { useSocket } from "./useSocket";
import { useAuth } from "../contexts/AuthContext";
import { useGameNotifications } from "./useGameNotifications";

export const useDeviceAuth = () => {
  const { socket } = useSocket();
  const { user, logout } = useAuth();
  const { showNotification } = useGameNotifications();

  useEffect(() => {
    if (!socket || !user) return;

    const handleForceLogout = (reason: string) => {
      showNotification({
        title: "Session Ended",
        message: reason,
        type: "error",
      });
      logout();
    };

    const handleDeviceCheck = () => {
      // Send current device info to server
      socket.emit("auth:device:check", {
        userId: user._id,
        deviceId: localStorage.getItem("deviceId") || "unknown",
        timestamp: new Date().toISOString(),
      });
    };

    socket.on("auth:force:logout", handleForceLogout);
    socket.on("auth:device:check", handleDeviceCheck);

    // Initial device check
    handleDeviceCheck();

    return () => {
      socket.off("auth:force:logout", handleForceLogout);
      socket.off("auth:device:check", handleDeviceCheck);
    };
  }, [socket, user]);

  // Generate a unique device ID if not exists
  useEffect(() => {
    if (!localStorage.getItem("deviceId")) {
      const deviceId = `device_${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("deviceId", deviceId);
    }
  }, []);
};
