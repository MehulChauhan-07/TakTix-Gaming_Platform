import { Server } from "socket.io";
import { AuthenticatedSocket } from "../types/socket.types";

interface DeviceSession {
  userId: string;
  deviceId: string;
  socketId: string;
  timestamp: string;
}

class DeviceAuthService {
  private sessions: Map<string, DeviceSession>;
  private io: Server | null;

  constructor() {
    this.sessions = new Map();
    this.io = null;
  }

  setIo(io: Server) {
    this.io = io;
  }

  handleDeviceCheck(
    socket: AuthenticatedSocket,
    data: { userId: string; deviceId: string; timestamp: string }
  ) {
    const existingSession = this.sessions.get(data.userId);

    if (existingSession && existingSession.deviceId !== data.deviceId) {
      // Another device is already logged in
      if (this.io) {
        // Force logout on the new device
        socket.emit(
          "auth:force:logout",
          "Another device is already logged in with this account"
        );

        // Notify the existing device
        this.io.to(existingSession.socketId).emit("auth:device:notification", {
          message: "Someone attempted to log in from another device",
          timestamp: new Date().toISOString(),
        });
      }
      return false;
    }

    // Update or create session
    this.sessions.set(data.userId, {
      userId: data.userId,
      deviceId: data.deviceId,
      socketId: socket.id,
      timestamp: data.timestamp,
    });

    return true;
  }

  removeSession(userId: string) {
    this.sessions.delete(userId);
  }

  getSession(userId: string): DeviceSession | undefined {
    return this.sessions.get(userId);
  }

  isValidSession(userId: string, deviceId: string): boolean {
    const session = this.sessions.get(userId);
    return session ? session.deviceId === deviceId : true;
  }
}

export const deviceAuthService = new DeviceAuthService();
