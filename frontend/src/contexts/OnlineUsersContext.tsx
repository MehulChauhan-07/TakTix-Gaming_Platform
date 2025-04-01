import React, { createContext, useContext, useState, useEffect } from "react";
import { useSocket } from "../hooks/useSocket";

interface OnlineUser {
  _id: string;
  username: string;
  profilePicture?: string;
  stats: {
    gamesPlayed: number;
    gamesWon: number;
    gamesLost: number;
    gamesDrawn: number;
    rating: number;
  };
}

interface OnlineUsersContextType {
  onlineUsers: OnlineUser[];
  loading: boolean;
}

const OnlineUsersContext = createContext<OnlineUsersContextType>({
  onlineUsers: [],
  loading: true,
});

export const OnlineUsersProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [loading, setLoading] = useState(true);
  const { socket } = useSocket();

  useEffect(() => {
    if (!socket) return;

    // Listen for online users updates
    socket.on("online-users", (users: OnlineUser[]) => {
      setOnlineUsers(users);
      setLoading(false);
    });

    // Request initial online users list
    socket.emit("get-online-users");

    return () => {
      socket.off("online-users");
    };
  }, [socket]);

  return (
    <OnlineUsersContext.Provider value={{ onlineUsers, loading }}>
      {children}
    </OnlineUsersContext.Provider>
  );
};

export const useOnlineUsers = () => {
  const context = useContext(OnlineUsersContext);
  if (context === undefined) {
    throw new Error(
      "useOnlineUsers must be used within an OnlineUsersProvider"
    );
  }
  return context;
};
