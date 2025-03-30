"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerGameHandlers = void 0;
const game_Service_1 = require("../services/game.Service");
const registerGameHandlers = (io, socket) => {
    // Get user ID from socket
    const getUserId = () => {
        const user = socket.data.user;
        return user ? user.id : null;
    };
    // Handle creating a new game
    socket.on("game:create", async (data) => {
        try {
            const { type, opponent } = data;
            const userId = getUserId();
            if (!userId) {
                socket.emit("error", { message: "Not authenticated" });
                return;
            }
            const game = await game_Service_1.GameService.createGame(userId, type, opponent);
            // Emit to both players
            io.to(userId).emit("game:created", game);
            io.to(opponent).emit("game:created", game);
            // Create a game room
            socket.join(`game:${game.id}`);
        }
        catch (error) {
            console.error("Socket game:create error:", error);
            socket.emit("error", { message: "Failed to create game" });
        }
    });
    // Handle joining a game
    socket.on("game:join", async (data) => {
        try {
            const { gameId } = data;
            const userId = getUserId();
            if (!userId) {
                socket.emit("error", { message: "Not authenticated" });
                return;
            }
            // Join the game room
            socket.join(`game:${gameId}`);
            // Notify other players
            socket.to(`game:${gameId}`).emit("game:player_joined", {
                gameId,
                player: { id: userId, username: socket.data.user.username },
            });
        }
        catch (error) {
            console.error("Socket game:join error:", error);
            socket.emit("error", { message: "Failed to join game" });
        }
    });
    // Handle making a move
    socket.on("game:move", async (data) => {
        try {
            const { gameId, position, playerId } = data;
            const userId = getUserId();
            if (!userId || userId !== playerId) {
                socket.emit("error", { message: "Not authorized to make this move" });
                return;
            }
            const move = { position, player: playerId };
            const updatedGame = await game_Service_1.GameService.makeMove(gameId, playerId, move);
            // Broadcast the updated game state to all players in the game room
            io.to(`game:${gameId}`).emit("game:update", updatedGame);
        }
        catch (error) {
            console.error("Socket game:move error:", error);
            socket.emit("error", {
                message: error instanceof Error ? error.message : "Failed to make move",
            });
        }
    });
    // Handle leaving a game
    socket.on("game:leave", (data) => {
        try {
            const { gameId } = data;
            const userId = getUserId();
            if (!gameId)
                return;
            // Leave the game room
            socket.leave(`game:${gameId}`);
            // Notify other players if this user is authenticated
            if (userId) {
                socket.to(`game:${gameId}`).emit("game:player_left", {
                    gameId,
                    playerId: userId,
                });
            }
        }
        catch (error) {
            console.error("Socket game:leave error:", error);
        }
    });
};
exports.registerGameHandlers = registerGameHandlers;
