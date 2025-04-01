import { Document, Types } from "mongoose";

export interface IGameState {
  board: any;
  currentPlayer: string;
  winner?: string;
  status: "active" | "completed" | "draw";
  moves?: Array<{
    player: string;
    move: any;
    timestamp: Date;
  }>;
}

export interface ChessGameState extends IGameState {
  board: Array<Array<string | null>>;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  check: boolean;
  checkmate: boolean;
  draw: boolean;
}

export interface TicTacToeGameState extends IGameState {
  board: Array<"X" | "O" | null>;
}

export interface IGame {
  type: "chess" | "tic-tac-toe";
  players: {
    white?: string;
    black?: string;
    X?: string;
    O?: string;
  };
  timeControl?: {
    initial: number;
    increment: number;
  };
}

export interface IPlayer {
  user: Types.ObjectId;
  color: "white" | "black";
  winner?: boolean;
  score?: number;
}

export interface IMessage {
  user: Types.ObjectId;
  message: string;
  timestamp: Date;
}

export interface IMatch extends Document {
  game: IGame;
  gameState: IGameState;
  startTime: Date;
  endTime?: Date;
  winner?: string;
  status: "pending" | "active" | "completed" | "draw";
  players: Array<{
    user: Types.ObjectId;
    color: string;
    score: number;
    winner: boolean;
  }>;
  spectators: Types.ObjectId[];
  messages: Array<{
    user: Types.ObjectId;
    content: string;
    timestamp: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

export interface ChessMatch extends IMatch {
  game: IGame & { type: "chess" };
  gameState: ChessGameState;
}

export interface TicTacToeMatch extends IMatch {
  game: IGame & { type: "tic-tac-toe" };
  gameState: TicTacToeGameState;
}

export type GameType = "tic-tac-toe" | "chess";

export type GameStatus = "pending" | "active" | "completed" | "draw";

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
