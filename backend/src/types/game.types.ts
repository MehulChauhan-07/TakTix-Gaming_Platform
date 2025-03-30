import { Document, Types } from "mongoose";

export interface IMatch extends Document {
  game: string; // "chess" | "tictactoe"
  players: Types.ObjectId[];
  currentTurn: Types.ObjectId;
  board: any; // Game-specific board representation
  status: "waiting" | "active" | "completed" | "abandoned";
  winner?: Types.ObjectId;
  moves: Array<{
    player: Types.ObjectId;
    move: any; // Game-specific move representation
    timestamp: Date;
  }>;
  startTime: Date;
  endTime?: Date;
}

export interface IGameMove {
  matchId: string;
  move: any; // Game-specific move representation
}

export type GameType = 'tictactoe' | 'chess' | 'checkers';

export type GameStatus = 'waiting' | 'in_progress' | 'completed' | 'cancelled';

export type Player = {
  id: string;
  username: string;
  avatar?: string;
};

export type GameState = {
  id: string;
  type: GameType;
  status: GameStatus;
  players: Player[];
  currentTurn: string;
  board: any; // This will be specific to each game type
  winner?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type GameMove = {
  playerId: string;
  position: number;
  timestamp: Date;
};

export type GameResult = {
  winner: string;
  score: number;
  moves: GameMove[];
  duration: number;
};