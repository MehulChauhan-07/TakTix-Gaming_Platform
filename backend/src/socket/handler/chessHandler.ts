import { Server } from "socket.io";
import { AuthenticatedSocket } from "../../types/socket.types";
import { ChessMatch, ChessGameState } from "../../models/match.model";
import Match from "../../models/match.model";
import mongoose from "mongoose";

// Initial chess board setup
const INITIAL_BOARD = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"],
];

interface ChessMove {
  from: { row: number; col: number };
  to: { row: number; col: number };
}

const handleChessEvents = (
  io: Server,
  socket: AuthenticatedSocket,
  match: ChessMatch & { _id: mongoose.Types.ObjectId }
) => {
  socket.on("game:move", async (data: ChessMove) => {
    try {
      const currentMatch = await Match.findById(match._id);
      if (!currentMatch) {
        socket.emit("error", "Match not found");
        return;
      }

      const { gameState } = currentMatch;
      const { board, currentPlayer, capturedPieces } =
        gameState as ChessGameState;

      // Validate it's the player's turn
      if (currentPlayer !== socket.data.userId) {
        socket.emit("error", "Not your turn");
        return;
      }

      // Get the piece at the starting position
      const piece = board[data.from.row][data.from.col];
      if (!piece) {
        socket.emit("error", "No piece at starting position");
        return;
      }

      // Validate piece belongs to current player
      const isWhitePiece = piece === piece.toUpperCase();
      const isWhitePlayer = match.game.players.white === socket.data.userId;
      if (isWhitePiece !== isWhitePlayer) {
        socket.emit("error", "Cannot move opponent's piece");
        return;
      }

      // Check if there's a piece to capture
      const capturedPiece = board[data.to.row][data.to.col];
      if (capturedPiece) {
        const capturedColor =
          capturedPiece === capturedPiece.toUpperCase() ? "white" : "black";
        capturedPieces[capturedColor].push(capturedPiece);
      }

      // Make the move
      board[data.to.row][data.to.col] = piece;
      board[data.from.row][data.from.col] = null;

      // TODO: Add proper chess move validation, check detection, and checkmate detection
      // For now, we'll use a simplified version

      // Switch turns
      const nextPlayer =
        match.game.players.white === currentPlayer
          ? match.game.players.black
          : match.game.players.white;

      // Update match
      await Match.findByIdAndUpdate(match._id, {
        gameState: {
          board,
          currentPlayer: nextPlayer,
          capturedPieces,
          check: false, // TODO: Implement proper check detection
          checkmate: false, // TODO: Implement proper checkmate detection
          draw: false, // TODO: Implement proper draw detection
        },
      });

      // Emit updated game state
      io.to(match._id.toString()).emit("game:updated", {
        board,
        currentPlayer: nextPlayer,
        capturedPieces,
        check: false,
        checkmate: false,
        draw: false,
      });
    } catch (error) {
      console.error("Error processing move:", error);
      socket.emit("error", "Failed to process move");
    }
  });

  socket.on("game:forfeit", async () => {
    try {
      const winner =
        match.game.players.white === socket.data.userId
          ? match.game.players.black
          : match.game.players.white;

      await Match.findByIdAndUpdate(match._id, {
        status: "completed",
        winner,
        endTime: new Date(),
        "gameState.status": "completed",
        "gameState.winner": winner,
      });

      io.to(match._id.toString()).emit("game:forfeited", { winner });
    } catch (error) {
      console.error("Error processing forfeit:", error);
      socket.emit("error", "Failed to process forfeit");
    }
  });

  socket.on("game:offer-draw", () => {
    io.to(match._id.toString()).emit("game:draw-offered", {
      player: socket.data.userId,
    });
  });

  socket.on("game:accept-draw", async () => {
    try {
      await Match.findByIdAndUpdate(match._id, {
        status: "draw",
        endTime: new Date(),
        "gameState.status": "draw",
        "gameState.draw": true,
      });

      io.to(match._id.toString()).emit("game:draw-accepted");
    } catch (error) {
      console.error("Error processing draw acceptance:", error);
      socket.emit("error", "Failed to process draw acceptance");
    }
  });

  socket.on("game:decline-draw", () => {
    io.to(match._id.toString()).emit("game:draw-declined");
  });
};

export default handleChessEvents;
