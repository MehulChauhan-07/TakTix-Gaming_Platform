"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const leaderboard_controller_1 = require("../controllers/leaderboard.controller");
const router = (0, express_1.Router)();
// Get global leaderboard
router.get("/", leaderboard_controller_1.getLeaderboard);
// Get leaderboard by game
router.get("/:gameType", leaderboard_controller_1.getLeaderboardByGame);
exports.default = router;
