const Game = require("../models/game.model");
const User = require("../models/user.model");
const jwt = require("jsonwebtoken");

module.exports = (io) => {
  // Authentication middleware for socket.io
  io.use((socket, next) => {
    if (socket.handshake.query && socket.handshake.query.token) {
      jwt.verify(
        socket.handshake.query.token,
        process.env.JWT_SECRET,
        (err, decoded) => {
          if (err) return next(new Error("Authentication error"));
          socket.userId = decoded.userId;
          next();
        }
      );
    } else {
      next(new Error("Authentication error"));
    }
  });

  io.on("connection", (socket) => {
    console.log(`User connected: ${socket.userId}`);

    // Join game room
    socket.on("joinGame", (gameId) => {
      socket.join(gameId);
      console.log(`User ${socket.userId} joined game ${gameId}`);
    });

    // Make a move
    socket.on("makeMove", async ({ gameId, move }) => {
      try {
        const game = await Game.findById(gameId);

        if (!game || game.status !== "active") {
          socket.emit("gameError", { message: "Invalid game" });
          return;
        }

        // Check if it's player's turn
        const playerIndex = game.players.findIndex(
          (p) => p.user.toString() === socket.userId.toString()
        );

        if (playerIndex === -1) {
          socket.emit("gameError", {
            message: "You are not part of this game",
          });
          return;
        }

        // Process move based on game type
        if (game.gameType === "chess") {
          // Process chess move
          // This would include chess move validation logic
          game.gameData.boardState = move.newBoardState;
        } else if (game.gameType === "ticTacToe") {
          // Process tic-tac-toe move
          const boardIndex = move.position;
          if (game.gameData.board[boardIndex] !== null) {
            socket.emit("gameError", { message: "Invalid move" });
            return;
          }

          // Update board
          game.gameData.board[boardIndex] = game.players[playerIndex].color;
        }

        // Record the move
        game.moves.push({
          player: socket.userId,
          move: JSON.stringify(move),
          timestamp: new Date(),
        });

        // Check for win or draw
        const gameResult = checkGameResult(game);
        if (gameResult.winner) {
          game.status = "completed";
          game.winner = gameResult.winner;
          game.endTime = new Date();

          // Update player stats
          await updatePlayerStats(game);
        } else if (gameResult.isDraw) {
          game.status = "completed";
          game.endTime = new Date();

          // Update player stats
          await updatePlayerStats(game);
        }

        await game.save();

        // Emit updated game state to both players
        io.to(gameId).emit("gameUpdated", game);

        // If game ended, emit result
        if (game.status === "completed") {
          io.to(gameId).emit("gameOver", {
            winner: game.winner,
            isDraw: !game.winner,
          });
        }
      } catch (error) {
        console.error("Make move error:", error);
        socket.emit("gameError", { message: "Server error" });
      }
    });

    // Disconnect
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.userId}`);
    });
  });
};

// Helper function to check game result
function checkGameResult(game) {
  if (game.gameType === "ticTacToe") {
    return checkTicTacToeResult(game);
  } else if (game.gameType === "chess") {
    // Chess result checking would be more complex
    // This is a placeholder
    return { winner: null, isDraw: false };
  }
  return { winner: null, isDraw: false };
}

// Check tic-tac-toe game result
function checkTicTacToeResult(game) {
  const board = game.gameData.board;
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
  ];

  // Check for win
  for (let line of lines) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      const winningColor = board[a]; // 'X' or 'O'
      const winner = game.players.find((p) => p.color === winningColor);
      return { winner: winner.user, isDraw: false };
    }
  }

  // Check for draw
  if (!board.includes(null)) {
    return { winner: null, isDraw: true };
  }

  return { winner: null, isDraw: false };
}

// Update player stats
async function updatePlayerStats(game) {
  try {
    const players = game.players.map((p) => p.user);

    for (const playerId of players) {
      const user = await User.findById(playerId);

      if (user) {
        user.stats.gamesPlayed += 1;

        if (game.winner) {
          if (game.winner.toString() === playerId.toString()) {
            user.stats.gamesWon += 1;
          } else {
            user.stats.gamesLost += 1;
          }
        } else {
          user.stats.gamesTied += 1;
        }

        await user.save();
      }
    }
  } catch (error) {
    console.error("Update player stats error:", error);
  }
}
