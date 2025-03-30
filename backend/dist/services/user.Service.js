"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserStats = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const updateUserStats = async (userId, result) => {
    const user = await user_model_1.default.findById(userId);
    if (!user) {
        throw new Error('User not found');
    }
    // Update stats based on game result
    user.stats.gamesPlayed += 1;
    switch (result) {
        case 'win':
            user.stats.gamesWon += 1;
            user.rating += 25; // Simple rating adjustment
            break;
        case 'loss':
            user.stats.gamesLost += 1;
            user.rating = Math.max(0, user.rating - 20); // Prevent negative rating
            break;
        case 'draw':
            user.stats.gamesDraw += 1;
            user.rating += 5; // Small rating increase for draws
            break;
    }
    await user.save();
};
exports.updateUserStats = updateUserStats;
