"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = handleTicTacToeEvents;
const user_service_1 = require("../../services/user.service");
function handleTicTacToeEvents(io, socket, match) {
    // Initialize tic-tac-toe game state if it doesn't exist
    if (!match.gameState || Object.keys(match.gameState).length === 0) {
        const initialState = {
            board: Array(9).fill(null),
            currentTurn: match.players[0].user.toString(),
            moves: [],
            winner: null,
            isDraw: false,
            gameOver: false
        };
        match.gameState = initialState;
        match.save();
    }
    // Send initial game state to the player
    socket.emit("game-state", match.gameState);
    // Handle move
    socket.on("make-move", async (moveData) => {
        try {
            const { index } = moveData;
            // Verify it's the player's turn
            if (match.gameState.currentTurn !== socket.userId) {
                return socket.emit("error", "Not your turn");
            }
            // Verify move is valid
            if (index < 0 ||
                index > 8 ||
                match.gameState.board[index] !== null ||
                match.gameState.gameOver) {
                return socket.emit("error", "Invalid move");
            }
            // Get player symbol (X or O)
            const playerIndex = match.players.findIndex((p) => p.user.toString() === socket.userId);
            const symbol = playerIndex === 0 ? "X" : "O";
            // Make the move
            const newBoard = [...match.gameState.board];
            newBoard[index] = symbol;
            // Check for win or draw
            const winPatterns = [
                [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
                [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
                [0, 4, 8], [2, 4, 6] // Diagonals
            ];
            let winner = null;
            let isDraw = false;
            let gameOver = false;
            // Check for win
            for (const pattern of winPatterns) {
                const [a, b, c] = pattern;
                if (newBoard[a] &&
                    newBoard[a] === newBoard[b] &&
                    newBoard[a] === newBoard[c]) {
                    winner = socket.userId;
                    gameOver = true;
                    break;
                }
            }
            // Check for draw if no winner
            if (!winner && !newBoard.includes(null)) {
                isDraw = true;
                gameOver = true;
            }
            // Update next turn
            const nextTurn = match.players.find((p) => p.user.toString() !== socket.userId)?.user.toString();
            // Update game state
            match.gameState = {
                ...match.gameState,
                board: newBoard,
                currentTurn: nextTurn || "",
                moves: [
                    ...match.gameState.moves,
                    { player: socket.userId, position: index, symbol }
                ],
                winner,
                isDraw,
                gameOver
            };
            // If game over, update match status and player stats
            if (gameOver) {
                match.status = "completed";
                match.endedAt = new Date();
                if (winner) {
                    // Update winner
                    const winnerPlayer = match.players.find((p) => p.user.toString() === winner);
                    if (winnerPlayer) {
                        winnerPlayer.winner = true;
                        winnerPlayer.score = 1;
                    }
                    // Update user stats
                    await (0, user_service_1.updateUserStats)(winner, 'win');
                    await (0, user_service_1.updateUserStats)(match.players.find((p) => p.user.toString() !== winner)?.user.toString() || "", 'loss');
                }
                else if (isDraw) {
                    // Update both players for a draw
                    for (const player of match.players) {
                        player.score = 0.5;
                        await (0, user_service_1.updateUserStats)(player.user.toString(), 'draw');
                    }
                }
            }
            await match.save();
            // Broadcast updated game state to all players and spectators
            io.to(`match:${match._id}`)
                .to(`match:${match._id}:spectators`)
                .emit("game-state", match.gameState);
            // Notify game over if applicable
            if (gameOver) {
                io.to(`match:${match._id}`)
                    .to(`match:${match._id}:spectators`)
                    .emit("game-over", {
                    winner: winner ? {
                        userId: winner,
                        username: socket.username,
                    } : null,
                    isDraw,
                });
            }
        }
        catch (error) {
            console.error("Make move error:", error);
            socket.emit("error", "Failed to make move");
        }
    });
    // Handle forfeit/resign
    socket.on("forfeit", async () => {
        try {
            if (match.status !== "active") {
                return socket.emit("error", "Cannot forfeit - game not active");
            }
            // Set other player as winner
            const winner = match.players.find((p) => p.user.toString() !== socket.userId);
            if (winner) {
                winner.winner = true;
                winner.score = 1;
                match.gameState.winner = winner.user.toString();
                match.gameState.gameOver = true;
            }
            match.status = "completed";
            match.endedAt = new Date();
            await match.save();
            // Update stats
            if (winner) {
                await (0, user_service_1.updateUserStats)(winner.user.toString(), 'win');
                await (0, user_service_1.updateUserStats)(socket.userId, 'loss');
            }
            // Notify players and spectators
            io.to(`match:${match._id}`)
                .to(`match:${match._id}:spectators`)
                .emit("game-over", {
                winner: winner ? {
                    userId: winner.user.toString(),
                    username: "Opponent", // Would be better to get actual username
                } : null,
                forfeit: true,
                forfeiter: {
                    userId: socket.userId,
                    username: socket.username,
                },
            });
        }
        catch (error) {
            console.error("Forfeit error:", error);
            socket.emit("error", "Failed to forfeit game");
        }
    });
}
