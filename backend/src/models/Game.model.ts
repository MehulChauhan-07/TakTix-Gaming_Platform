import mongoose, { Schema, Document } from "mongoose";
import { GameState, GameType, GameStatus } from "../types/game.types";

export interface IGame extends Document, Omit<GameState, "id"> {
  // Add any additional methods here
}

const gameSchema = new Schema<IGame>(
  {
    type: {
      type: String,
      enum: ["tictactoe", "chess", "checkers"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "active", "completed", "draw"],
      default: "pending",
    },
    players: [
      {
        id: { type: String, required: true },
        username: { type: String, required: true },
        avatar: String,
      },
    ],
    currentTurn: {
      type: String,
      required: true,
    },
    board: {
      type: Schema.Types.Mixed,
      required: true,
    },
    winner: String,
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
gameSchema.index({ type: 1, status: 1 });
gameSchema.index({ "players.id": 1 });

export const Game = mongoose.model<IGame>("Game", gameSchema);
