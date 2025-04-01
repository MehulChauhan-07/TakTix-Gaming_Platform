import { Server } from "socket.io";
import { AuthenticatedSocket } from "../../types/socket.types";
import { TicTacToeMatch, TicTacToeGameState } from "../../models/match.model";
import Match from "../../models/match.model";
import mongoose from "mongoose";
import { updateUserStats, GameResult } from "../../services/userService";

const handleTicTacToeEvents = (
  io: Server,
  socket: AuthenticatedSocket,
  match: TicTacToeMatch & { _id: mongoose.Types.ObjectId }
) => {
  socket.on("game:move", async (data: { position: number }) => {
    try {
      const { position } = data;
      const currentMatch = await Match.findById(match._id);
      if (!currentMatch) {
        socket.emit("error", "Match not found");
        return;
      }

      const { gameState } = currentMatch;
      const { board, currentPlayer } = gameState as TicTacToeGameState;

      // Validate move
      if (
        position < 0 ||
        position > 8 ||
        board[position] ||
        currentPlayer !== socket.data.userId
      ) {
        socket.emit("error", "Invalid move");
        return;
      }

      // Update board
      const symbol = match.game.players.X === socket.data.userId ? "X" : "O";
      board[position] = symbol;

      // Check for win
      const winningCombos = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8], // Rows
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8], // Columns
        [0, 4, 8],
        [2, 4, 6], // Diagonals
      ];

      let winner = null;
      for (const combo of winningCombos) {
        if (
          board[combo[0]] &&
          board[combo[0]] === board[combo[1]] &&
          board[combo[0]] === board[combo[2]]
        ) {
          winner = socket.data.userId;
          break;
        }
      }

      // Check for draw
      const isDraw =
        !winner && board.every((cell: string | null) => cell !== null);

      // Update match
      const nextPlayer =
        match.game.players.X === currentPlayer
          ? match.game.players.O
          : match.game.players.X;

      const status = winner ? "completed" : isDraw ? "draw" : "active";

      await Match.findByIdAndUpdate(match._id, {
        gameState: {
          board,
          currentPlayer: nextPlayer,
          winner,
          status,
        },
        status: status === "active" ? "active" : status,
        ...(winner && { winner }),
        ...(status !== "active" && { endTime: new Date() }),
      });

      // Emit updated game state
      io.to(match._id.toString()).emit("game:updated", {
        board,
        currentPlayer: nextPlayer,
        winner,
        status,
      });
    } catch (error) {
      console.error("Error processing move:", error);
      socket.emit("error", "Failed to process move");
    }
  });

  socket.on("game:forfeit", async () => {
    try {
      const winner =
        match.game.players.X === socket.data.userId
          ? match.game.players.O
          : match.game.players.X;

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
};

export default handleTicTacToeEvents;
