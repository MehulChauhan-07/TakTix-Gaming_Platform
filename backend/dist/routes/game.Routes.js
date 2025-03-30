"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const game_controller_1 = require("../controllers/game.controller");
const router = (0, express_1.Router)();
// All routes require authentication
router.use(auth_1.auth);
// Get all games
router.get("/", game_controller_1.getGames);
// Create a new game
router.post("/", game_controller_1.createGame);
// Get game by id
router.get("/:gameId", game_controller_1.getGameById);
// Join a game
router.post("/:id/join", game_controller_1.joinGame);
// Make a move
router.post("/:gameId/move", game_controller_1.makeMove);
// Resign a game
router.post("/:id/resign", game_controller_1.resignGame);
// Get active games
router.get("/active", game_controller_1.getActiveGames);
// Get game history
router.get("/history", game_controller_1.getGameHistory);
// Get active games for a player
router.get('/player/:playerId/active', game_controller_1.getActiveGames);
// Get game history for a player
router.get('/player/:playerId/history', game_controller_1.getGameHistory);
exports.default = router;
