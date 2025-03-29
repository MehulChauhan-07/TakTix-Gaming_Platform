const express = require("express");
const router = express.Router();
const gameController = require("../controllers/game.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Apply auth middleware to all game routes
router.use(authMiddleware);

// Create new game
router.post("/", gameController.createGame);

// Join a game
router.post("/:gameId/join", gameController.joinGame);

// Get available games
router.get("/available", gameController.getAvailableGames);

// Get user's games
router.get("/my-games", gameController.getUserGames);

// Get game by ID
router.get("/:gameId", gameController.getGameById);

module.exports = router;
