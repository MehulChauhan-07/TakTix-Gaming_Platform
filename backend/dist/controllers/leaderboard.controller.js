"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLeaderboardByGame = exports.getLeaderboard = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const game_model_1 = require("../models/game.model");
// Get global leaderboard
const getLeaderboard = async (req, res) => {
    try {
        // Get top players based on rating
        const leaderboard = await user_model_1.default.find()
            .select('username profilePicture rating stats')
            .sort({ rating: -1 })
            .limit(100);
        res.status(200).json({
            status: 'success',
            data: leaderboard,
        });
    }
    catch (error) {
        console.error('Error fetching leaderboard:', error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch leaderboard',
        });
    }
};
exports.getLeaderboard = getLeaderboard;
// Get leaderboard by game type
const getLeaderboardByGame = async (req, res) => {
    try {
        const { gameType } = req.params;
        // Validate game type
        if (!['tictactoe', 'chess', 'checkers'].includes(gameType)) {
            res.status(400).json({
                status: 'error',
                message: 'Invalid game type',
            });
            return;
        }
        // Get top players for specific game type using aggregation
        const leaderboard = await game_model_1.Game.aggregate([
            { $match: { type: gameType, status: 'completed' } },
            { $unwind: '$players' },
            {
                $group: {
                    _id: '$players.id',
                    username: { $first: '$players.username' },
                    gamesPlayed: { $sum: 1 },
                    wins: {
                        $sum: {
                            $cond: [{ $eq: ['$winner', '$players.id'] }, 1, 0],
                        },
                    },
                },
            },
            {
                $project: {
                    username: 1,
                    gamesPlayed: 1,
                    wins: 1,
                    winRate: {
                        $round: [{ $multiply: [{ $divide: ['$wins', '$gamesPlayed'] }, 100] }, 1],
                    },
                },
            },
            { $sort: { wins: -1, winRate: -1 } },
            { $limit: 50 },
        ]);
        res.status(200).json({
            status: 'success',
            data: leaderboard,
        });
    }
    catch (error) {
        console.error(`Error fetching ${req.params.gameType} leaderboard:`, error);
        res.status(500).json({
            status: 'error',
            message: 'Failed to fetch game leaderboard',
        });
    }
};
exports.getLeaderboardByGame = getLeaderboardByGame;
