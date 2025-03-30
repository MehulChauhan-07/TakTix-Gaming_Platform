import { Socket } from 'socket.io';

export interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export interface GameMove {
  from: string;
  to: string;
  piece?: string;
  promotion?: string;
}

export interface ChatMessage {
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
}

export interface GameState {
  board: any;
  currentTurn: string;
  moves: GameMove[];
  capturedPieces?: {
    white: string[];
    black: string[];
  };
  check?: boolean;
  checkmate?: boolean;
  draw?: boolean;
} 