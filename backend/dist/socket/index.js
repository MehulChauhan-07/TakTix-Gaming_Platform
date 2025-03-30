"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = initializeSocket;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const match_model_1 = __importDefault(require("../models/match.model"));
const mongoose_1 = require("mongoose");
// Game-specific handlers
const chessHandler_1 = __importDefault(require("./handler/chessHandler"));
const ticTacToeHandler_1 = __importDefault(require("./handler/ticTacToeHandler"));
function initializeSocket(io) {
    // Middleware to authenticate socket connections
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (!token) {
            return next(new Error("Authentication error"));
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "your-secret-key");
            const user = (await user_model_1.default.findById(decoded.id));
            if (!user) {
                return next(new Error("User not found"));
            }
            socket.userId = user._id;
            socket.username = user.username;
            next();
        }
        catch (error) {
            next(new Error("Authentication error"));
        }
    });
    // Connection event
    io.on("connection", ((socket) => {
        const authenticatedSocket = socket;
        console.log(`User connected: ${authenticatedSocket.username} (${authenticatedSocket.userId})`);
        // Join user to their personal room
        authenticatedSocket.join(`user:${authenticatedSocket.userId}`);
        // Handle matchmaking
        authenticatedSocket.on("join-matchmaking", async (gameId) => {
            try {
                // Find waiting matches for this game
                const waitingMatch = await match_model_1.default.findOne({
                    game: gameId,
                    status: "waiting",
                    "players.1": { $exists: false }, // Only one player in the match
                });
                if (waitingMatch) {
                    // Join existing match
                    waitingMatch.players.push({
                        user: new mongoose_1.Schema.Types.ObjectId(authenticatedSocket.userId),
                        color: waitingMatch.players[0].color === "white" ? "black" : "white",
                        score: 0,
                        winner: false
                    });
                    waitingMatch.status = "active";
                    waitingMatch.startedAt = new Date();
                    await waitingMatch.save();
                    // Notify both players
                    io.to(`match:${waitingMatch._id}`).emit("match-started", waitingMatch._id);
                    authenticatedSocket.join(`match:${waitingMatch._id}`);
                    // Notify match creator
                    io.to(`user:${waitingMatch.players[0].user}`).emit("opponent-joined", {
                        matchId: waitingMatch._id,
                        opponent: authenticatedSocket.username,
                    });
                    // Notify the player who just joined
                    authenticatedSocket.emit("match-joined", {
                        matchId: waitingMatch._id,
                        opponent: await user_model_1.default.findById(waitingMatch.players[0].user).select("username profilePicture"),
                    });
                }
                else {
                    // Create new match
                    const newMatch = new match_model_1.default({
                        game: new mongoose_1.Schema.Types.ObjectId(gameId),
                        players: [
                            {
                                user: new mongoose_1.Schema.Types.ObjectId(authenticatedSocket.userId),
                                color: "white",
                                score: 0,
                                winner: false
                            },
                        ],
                        status: "waiting",
                        gameState: {},
                        spectators: [],
                        messages: []
                    });
                    await newMatch.save();
                    // Join match room
                    authenticatedSocket.join(`match:${newMatch._id}`);
                    // Notify player
                    authenticatedSocket.emit("waiting-for-opponent", newMatch._id);
                }
            }
            catch (error) {
                console.error("Join matchmaking error:", error);
                authenticatedSocket.emit("matchmaking-error", "Failed to join matchmaking");
            }
        });
        // Handle game-specific events
        authenticatedSocket.on("join-game", async (matchId) => {
            try {
                const match = await match_model_1.default.findById(matchId).populate("game").lean();
                if (!match) {
                    return authenticatedSocket.emit("error", "Match not found");
                }
                // Join match room
                authenticatedSocket.join(`match:${matchId}`);
                // Route to game-specific handlers based on game type
                const gameType = match.game.slug;
                switch (gameType) {
                    case "chess":
                        (0, chessHandler_1.default)(io, authenticatedSocket, match);
                        break;
                    case "tic-tac-toe":
                        (0, ticTacToeHandler_1.default)(io, authenticatedSocket, match);
                        break;
                    default:
                        authenticatedSocket.emit("error", "Unsupported game type");
                }
            }
            catch (error) {
                console.error("Join game error:", error);
                authenticatedSocket.emit("error", "Failed to join game");
            }
        });
        // Handle spectating
        authenticatedSocket.on("spectate", async (matchId) => {
            try {
                const match = await match_model_1.default.findById(matchId);
                if (!match) {
                    return authenticatedSocket.emit("error", "Match not found");
                }
                // Add user to spectators if not already there
                const userId = new mongoose_1.Schema.Types.ObjectId(authenticatedSocket.userId);
                if (!match.spectators.some(id => id.toString() === userId.toString())) {
                    match.spectators.push(userId);
                    await match.save();
                }
                // Join match room as spectator
                authenticatedSocket.join(`match:${matchId}:spectators`);
                // Send current game state
                authenticatedSocket.emit("game-state", match.gameState);
                // Notify players of new spectator
                io.to(`match:${matchId}`).emit("spectator-joined", authenticatedSocket.username);
            }
            catch (error) {
                console.error("Spectate error:", error);
                authenticatedSocket.emit("error", "Failed to spectate game");
            }
        });
        // In-game chat
        authenticatedSocket.on("send-message", async (matchId, message) => {
            try {
                const match = await match_model_1.default.findById(matchId);
                if (!match) {
                    return authenticatedSocket.emit("error", "Match not found");
                }
                // Add message to match
                match.messages.push({
                    user: new mongoose_1.Schema.Types.ObjectId(authenticatedSocket.userId),
                    message,
                    timestamp: new Date()
                });
                await match.save();
                // Broadcast message to all users in the match
                io.to(`match:${matchId}`)
                    .to(`match:${matchId}:spectators`)
                    .emit("new-message", {
                    username: authenticatedSocket.username,
                    message,
                    timestamp: new Date(),
                });
            }
            catch (error) {
                console.error("Send message error:", error);
                authenticatedSocket.emit("error", "Failed to send message");
            }
        });
        // Disconnect event
        authenticatedSocket.on("disconnect", () => {
            console.log(`User disconnected: ${authenticatedSocket.username} (${authenticatedSocket.userId})`);
        });
    }));
}
