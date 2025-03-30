import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/user.model";
import Match from "../models/match.model";
import { registerGameHandlers } from './gameHandlers';
import { verifyToken } from '../middleware/auth';

interface AuthenticatedSocket extends Socket {
  userId: string;
  username: string;
}

export const setupSocketHandlers = (io: Server): void => {
  // Middleware to authenticate socket connections
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }

      const user = await verifyToken(token);
      if (!user) {
        return next(new Error('Authentication error'));
      }

      // Attach user data to socket
      socket.data.user = user;
      next();
    } catch (error) {
      console.error('Socket authentication error:', error);
      next(new Error('Authentication error'));
    }
  });

  // Handle new connections
  io.on('connection', (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // Join user to their personal room
    if (socket.data.user) {
      socket.join(socket.data.user.id);
    }

    // Register all event handlers
    registerGameHandlers(io, socket);
    // Add more handlers here as needed

    // Handle disconnection
    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
};
