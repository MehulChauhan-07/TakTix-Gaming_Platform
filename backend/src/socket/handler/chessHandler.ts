import { Server, Socket } from 'socket.io';
import { IMatch } from '../../models/match.model';
import { Chess, Square } from 'chess.js';
import { Document } from 'mongoose';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

interface MoveData {
  from: Square;
  to: Square;
}

interface ChessGameState {
  board: Chess;
  currentTurn: string;
  moves: Array<{ from: Square; to: Square; player: string }>;
  capturedPieces: {
    white: string[];
    black: string[];
  };
  check: boolean;
  checkmate: boolean;
  draw: boolean;
}

interface ChessMatch extends Omit<IMatch, 'gameState'> {
  gameState: ChessGameState;
  _id: Document['_id'];
}

// Initialize a new chess board
function initializeChessBoard(): Chess {
  return new Chess();
}

// Validate chess move using chess.js
function validateChessMove(chess: Chess, from: Square, to: Square): boolean {
  try {
    const move = chess.move({ from, to });
    if (move) {
      chess.undo(); // Undo the move as we're just validating
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Make a move on the chess board
function makeMove(chess: Chess, from: Square, to: Square): Chess {
  chess.move({ from, to });
  return chess;
}

export default function handleChessEvents(io: Server, socket: AuthenticatedSocket, match: ChessMatch) {
  // Initialize chess game state if it doesn't exist
  if (!match.gameState.board) {
    const chess = initializeChessBoard();
    match.gameState = {
      board: chess,
      currentTurn: match.players[0].user.toString(),
      moves: [],
      capturedPieces: {
        white: [],
        black: []
      },
      check: false,
      checkmate: false,
      draw: false
    };
    match.save();
  }
  
  // Send initial game state to the player
  socket.emit('game-state', match.gameState);
  
  // Handle move
  socket.on('make-move', async (moveData: MoveData) => {
    try {
      const { from, to } = moveData;
      
      // Verify it's the player's turn
      if (match.gameState.currentTurn !== socket.userId) {
        return socket.emit('error', 'Not your turn');
      }
      
      const chess = new Chess(match.gameState.board.fen());
      
      // Validate move using chess.js
      if (!validateChessMove(chess, from, to)) {
        return socket.emit('error', 'Invalid move');
      }

      // Make the move
      match.gameState.board = makeMove(chess, from, to);
      match.gameState.moves.push({ from, to, player: socket.userId });
      
      // Update game state
      const nextPlayer = match.players.find(
        (p) => p.user.toString() !== socket.userId
      );
      match.gameState.currentTurn = nextPlayer?.user.toString() || '';
      
      // Check game status
      match.gameState.check = chess.inCheck();
      match.gameState.checkmate = chess.isCheckmate();
      match.gameState.draw = chess.isDraw();
      
      // Save and broadcast new state
      await match.save();
      const roomId = String(match._id);
      io.to(roomId).emit('game-state', match.gameState);
      
      // Handle game end conditions
      if (match.gameState.checkmate || match.gameState.draw) {
        match.status = 'completed';
        if (match.gameState.checkmate) {
          match.winner = match.players.find(
            p => p.user.toString() === socket.userId
          )?.user;
        }
        await match.save();
        io.to(roomId).emit('game-end', {
          winner: match.winner,
          draw: match.gameState.draw
        });
      }
    } catch (error) {
      console.error('Error making move:', error);
      socket.emit('error', 'Failed to make move');
    }
  });
}