import { Socket } from "socket.io";

export interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    username: string;
  };
}

export interface DeviceCheckData {
  userId: string;
  deviceId: string;
  timestamp: string;
}

export interface GameMove {
  matchId: string;
  move: any; // Replace with specific move type based on game
}

export interface ChatMessage {
  matchId: string;
  content: string;
  userId: string;
  username: string;
}
