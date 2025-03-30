import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createGame,
  getGames,
  getGameById,
  joinGame,
  makeMove,
  resignGame,
  getActiveGames,
  getGameHistory
} from "../controllers/game.controller";

const router = Router();

// All routes require authentication
router.use(auth);

// Get all games
router.get("/", getGames);

// Create a new game
router.post("/", createGame);

// Get game by id
router.get("/:gameId", getGameById);

// Join a game
router.post("/:id/join", joinGame);

// Make a move
router.post("/:gameId/move", makeMove);

// Resign a game
router.post("/:id/resign", resignGame);

// Get active games
router.get("/active", getActiveGames);

// Get game history
router.get("/history", getGameHistory);

// Get active games for a player
router.get('/player/:playerId/active', getActiveGames);

// Get game history for a player
router.get('/player/:playerId/history', getGameHistory);

export default router;
