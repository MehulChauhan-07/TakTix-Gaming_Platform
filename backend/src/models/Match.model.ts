import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IGameState {
  board: (string | null)[];
  currentTurn: string;
  moves: Array<{
    player: string;
    position: number;
    symbol: string;
  }>;
  winner?: string | null;
  isDraw?: boolean;
  gameOver?: boolean;
}

export interface IPlayer {
  user: ObjectId;
  color: 'white' | 'black';
  winner?: boolean;
  score?: number;
}

export interface IMessage {
  user: ObjectId;
  message: string;
  timestamp: Date;
}

export interface IMatch extends Document {
  game: ObjectId;
  players: IPlayer[];
  status: 'waiting' | 'active' | 'completed';
  gameState: IGameState;
  spectators: ObjectId[];
  messages: IMessage[];
  startedAt?: Date;
  endedAt?: Date;
  winner?: ObjectId;
}

const MatchSchema: Schema = new Schema(
  {
    game: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
    players: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        color: { type: String, enum: ['white', 'black'], required: true },
        winner: { type: Boolean, default: false },
        score: { type: Number, default: 0 }
      },
    ],
    status: {
      type: String,
      enum: ['waiting', 'active', 'completed'],
      default: 'waiting'
    },
    gameState: { type: Schema.Types.Mixed, default: {} },
    spectators: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    messages: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      message: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }],
    startedAt: { type: Date },
    endedAt: { type: Date },
    winner: { type: Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model<IMatch>("Match", MatchSchema);
