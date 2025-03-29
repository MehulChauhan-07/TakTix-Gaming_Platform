import { Server, Socket } from 'socket.io';
import { IMatch } from '../../models/Match';
import User from '../../models/User';

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export default function handleChessEvents(io: Server, socket: AuthenticatedSocket, match: IMatch) {
  // Initialize chess game state if it doesn't exist
  if (Object.keys(match.gameState).length === 0) {
    match.gameState = {
      board: initializeChessBoard(),
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
  socket.on('make-move', async (moveData) => {
    try {
      const { from, to } = moveData;
      
      // Verify it's the player's turn
      if (match.gameState.currentTurn !== socket.userId) {
        return socket.emit('error', 'Not your turn');
      }
      
      // Validate move (simplified - in a real app, use a chess library like chess.js)
      const isValidMove = validateChessMove(match.gameState.board, from, to, socket.userId);
      
      if (!is