import { Server, Socket } from "socket.io";
import User from "../../models/user.model";
import { AuthenticatedSocket } from "../types";

export const handleUserStatus = async (
  io: Server,
  socket: AuthenticatedSocket
) => {
  try {
    // Update user's online status
    await User.findByIdAndUpdate(socket.userId, {
      isOnline: true,
      lastSeen: new Date(),
    });

    // Get online users
    const onlineUsers = await User.find({ isOnline: true })
      .select("username profilePicture stats")
      .lean();

    // Broadcast online users to all connected clients
    io.emit("online-users", onlineUsers);

    // Handle disconnection
    socket.on("disconnect", async () => {
      await User.findByIdAndUpdate(socket.userId, {
        isOnline: false,
        lastSeen: new Date(),
      });

      // Update online users list
      const updatedOnlineUsers = await User.find({ isOnline: true })
        .select("username profilePicture stats")
        .lean();
      io.emit("online-users", updatedOnlineUsers);
    });

    // Handle game state updates
    socket.on("update-game-state", async (gameId: string) => {
      await User.findByIdAndUpdate(socket.userId, {
        currentGame: gameId,
      });
    });

    // Handle chat messages
    socket.on(
      "send-message",
      async (data: {
        gameId: string;
        message: string;
        type: "game" | "system";
      }) => {
        const { gameId, message, type } = data;

        // Only allow chat if there are at least 2 players
        const game = await User.find({ currentGame: gameId });
        if (game.length < 2) {
          socket.emit("chat-error", "Need at least 2 players to enable chat");
          return;
        }

        io.to(`game:${gameId}`).emit("new-message", {
          userId: socket.userId,
          username: socket.username,
          message,
          type,
          timestamp: new Date(),
        });
      }
    );
  } catch (error) {
    console.error("User status handler error:", error);
    socket.emit("error", "Failed to update user status");
  }
};
