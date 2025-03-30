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