import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { IUser } from "./user.model";
import {
  IMatch,
  IGame,
  IGameState,
  ChessGameState,
  TicTacToeGameState,
  ChessMatch,
  TicTacToeMatch,
} from "../types/game.types";

export interface IPlayer {
  user: ObjectId;
  color: "white" | "black";
  winner?: boolean;
  score?: number;
}

export interface IMessage {
  user: ObjectId;
  message: string;
  timestamp: Date;
}

const gameSchema = new Schema<IGame>({
  type: {
    type: String,
    enum: ["chess", "tic-tac-toe"],
    required: true,
  },
  players: {
    white: String,
    black: String,
    X: String,
    O: String,
  },
  timeControl: {
    initial: Number,
    increment: Number,
  },
});

const baseGameStateSchema = new Schema<IGameState>({
  board: Schema.Types.Mixed,
  currentPlayer: String,
  winner: String,
  status: {
    type: String,
    enum: ["active", "completed", "draw"],
    default: "active",
  },
  moves: [
    {
      player: String,
      move: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const chessGameStateSchema = new Schema<ChessGameState>({
  board: [[String]],
  currentPlayer: String,
  winner: String,
  status: {
    type: String,
    enum: ["active", "completed", "draw"],
    default: "active",
  },
  moves: [
    {
      player: String,
      move: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
    },
  ],
  capturedPieces: {
    white: [String],
    black: [String],
  },
  check: { type: Boolean, default: false },
  checkmate: { type: Boolean, default: false },
  draw: { type: Boolean, default: false },
});

const ticTacToeGameStateSchema = new Schema<TicTacToeGameState>({
  board: [String],
  currentPlayer: String,
  winner: String,
  status: {
    type: String,
    enum: ["active", "completed", "draw"],
    default: "active",
  },
  moves: [
    {
      player: String,
      move: Schema.Types.Mixed,
      timestamp: { type: Date, default: Date.now },
    },
  ],
});

const matchSchema = new Schema<IMatch>(
  {
    game: gameSchema,
    gameState: {
      type: Schema.Types.Mixed,
      required: true,
    },
    startTime: { type: Date, default: Date.now },
    endTime: Date,
    winner: String,
    status: {
      type: String,
      enum: ["pending", "active", "completed", "draw"],
      default: "pending",
    },
    players: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        color: String,
        score: { type: Number, default: 0 },
        winner: { type: Boolean, default: false },
      },
    ],
    spectators: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [
      {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true },
        content: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Add discriminators for specific game types
const Match = mongoose.model<IMatch>("Match", matchSchema);
const ChessMatchModel = Match.discriminator<ChessMatch>(
  "ChessMatch",
  new Schema({
    game: {
      ...gameSchema.obj,
      type: { type: String, enum: ["chess"], required: true },
    },
    gameState: chessGameStateSchema,
  })
);
const TicTacToeMatchModel = Match.discriminator<TicTacToeMatch>(
  "TicTacToeMatch",
  new Schema({
    game: {
      ...gameSchema.obj,
      type: { type: String, enum: ["tic-tac-toe"], required: true },
    },
    gameState: ticTacToeGameStateSchema,
  })
);

export { Match, ChessMatchModel, TicTacToeMatchModel };
export type {
  IMatch,
  IGame,
  IGameState,
  ChessGameState,
  TicTacToeGameState,
  ChessMatch,
  TicTacToeMatch,
};
