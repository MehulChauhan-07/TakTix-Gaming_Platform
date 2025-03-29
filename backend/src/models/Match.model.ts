import mongoose, { Schema, Document } from "mongoose";

export interface IMatch extends Document {
  game: mongoose.Types.ObjectId;
  players: {
    user: mongoose.Types.ObjectId;
    score: number;
    winner: boolean;
  }[];
  status: "waiting" | "active" | "completed" | "cancelled";
  gameState: Record<string, any>;
  startedAt?: Date;
  endedAt?: Date;
  spectators: mongoose.Types.ObjectId[];
  messages: {
    user: mongoose.Types.ObjectId;
    message: string;
    timestamp: Date;
  }[];
}

const MatchSchema: Schema = new Schema(
  {
    game: {
      type: Schema.Types.ObjectId,
      ref: "Game",
      required: true,
    },
    players: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        score: {
          type: Number,
          default: 0,
        },
        winner: {
          type: Boolean,
          default: false,
        },
      },
    ],
    status: {
      type: String,
      enum: ["waiting", "active", "completed", "cancelled"],
      default: "waiting",
    },
    gameState: {
      type: Schema.Types.Mixed,
      default: {},
    },
    startedAt: {
      type: Date,
    },
    endedAt: {
      type: Date,
    },
    spectators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    messages: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
        message: {
          type: String,
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IMatch>("Match", MatchSchema);
