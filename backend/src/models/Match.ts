import mongoose, { Schema, Document } from 'mongoose';

export interface IGameState {
  board: any;
  currentTurn: string;
  moves: Array<{
    from: string;
    to: string;
    player: string;
  }>;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  check: boolean;
  checkmate: boolean;
  draw: boolean;
}

export interface IMatch extends Document {
  players: Array<{
    user: mongoose.Types.ObjectId;
    color: 'white' | 'black';
  }>;
  gameType: 'chess' | 'checkers' | 'tictactoe';
  gameState: IGameState;
  status: 'pending' | 'active' | 'completed';
  winner?: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const MatchSchema: Schema = new Schema({
  players: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    color: {
      type: String,
      enum: ['white', 'black'],
      required: true
    }
  }],
  gameType: {
    type: String,
    enum: ['chess', 'checkers', 'tictactoe'],
    required: true
  },
  gameState: {
    type: Object,
    default: {}
  },
  status: {
    type: String,
    enum: ['pending', 'active', 'completed'],
    default: 'pending'
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

export default mongoose.model<IMatch>('Match', MatchSchema); 