import { Router } from "express";
import {
  getLeaderboard,
  getLeaderboardByGame
} from "../controllers/leaderboard.controller";

const router = Router();

// Get global leaderboard
router.get("/", getLeaderboard);

// Get leaderboard by game
router.get("/:gameType", getLeaderboardByGame);

export default router;