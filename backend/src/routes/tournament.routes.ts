import { Router } from "express";
import { auth } from "../middleware/auth";
import {
  createTournament,
  getTournaments,
  getTournamentById,
  joinTournament,
  leaveTournament,
  startTournament,
  endTournament,
} from "../controllers/tournament.controller";

const router = Router();

// Get all tournaments
router.get("/", getTournaments);

// Create a new tournament
router.post("/", auth, createTournament);

// Get tournament by id
router.get("/:id", getTournamentById);

// Join a tournament
router.post("/:id/join", auth, joinTournament);

// Leave a tournament
router.post("/:id/leave", auth, leaveTournament);

// Start a tournament (admin only)
router.post("/:id/start", auth, startTournament);

// End a tournament (admin only)
router.post("/:id/end", auth, endTournament);

export default router;
