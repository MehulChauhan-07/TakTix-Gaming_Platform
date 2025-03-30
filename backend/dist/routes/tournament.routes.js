"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const tournament_controller_1 = require("../controllers/tournament.controller");
const router = (0, express_1.Router)();
// Get all tournaments
router.get("/", tournament_controller_1.getTournaments);
// Create a new tournament
router.post("/", auth_1.auth, tournament_controller_1.createTournament);
// Get tournament by id
router.get("/:id", tournament_controller_1.getTournamentById);
// Join a tournament
router.post("/:id/join", auth_1.auth, tournament_controller_1.joinTournament);
// Leave a tournament
router.post("/:id/leave", auth_1.auth, tournament_controller_1.leaveTournament);
// Start a tournament (admin only)
router.post("/:id/start", auth_1.auth, tournament_controller_1.startTournament);
// End a tournament (admin only)
router.post("/:id/end", auth_1.auth, tournament_controller_1.endTournament);
exports.default = router;
