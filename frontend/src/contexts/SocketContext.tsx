import React, { createContext, useContext, useEffect, useState } from "react";
import SocketService from "../services/socket.service";
import { AuthContext } from "./AuthContext";

interface SocketContextType {
  socket: SocketService | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export const useSocket = () => useContext(SocketContext);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<SocketService | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user?.token) {
      const socketService = SocketService.getInstance();
      socketService.connect(user.token);
      setSocket(socketService);

      const checkConnection = () => {
        setIsConnected(socketService.isConnected());
      };

      // Check connection status periodically
      const interval = setInterval(checkConnection, 1000);

      return () => {
        clearInterval(interval);
        socketService.disconnect();
      };
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
