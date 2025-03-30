"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameService = void 0;
const tictactoe_1 = require("../utils/gameLogic/tictactoe");
// import { Chess } from '../utils/gameLogic/chess';
// import { Checkers } from '../utils/gameLogic/checkers';
const match_model_1 = __importDefault(require("../models/match.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_2 = require("mongoose");
class GameService {
    static getGameLogic(type) {
        switch (type) {
            case 'tictactoe':
                return new tictactoe_1.TicTacToe();
            // case 'chess':
            //   return new Chess();
            // case 'checkers':
            //   return new Checkers();
            default:
                throw new Error(`Unsupported game type: ${type}`);
        }
    }
    static async createGame(userId, gameType, opponentId) {
        const match = new match_model_1.default({
            gameType,
            players: [
                {
                    user: new mongoose_2.Schema.Types.ObjectId(userId),
                    color: 'white'
                }
            ],
            status: opponentId ? 'pending' : 'waiting'
        });
        if (opponentId) {
            match.players.push({
                user: new mongoose_2.Schema.Types.ObjectId(opponentId),
                color: 'black'
            });
        }
        await match.save();
        return match;
    }
    static async getGame(gameId) {
        return match_model_1.default.findById(gameId).populate('players.user');
    }
    static async getGames(userId) {
        return match_model_1.default.find({
            'players.user': new mongoose_1.default.Types.ObjectId(userId)
        }).populate('players.user');
    }
    static async getGameById(gameId) {
        return match_model_1.default.findById(gameId).populate('players.user');
    }
    static async joinGame(gameId, userId) {
        const match = await match_model_1.default.findById(gameId);
        if (!match) {
            throw new Error('Game not found');
        }
        if (match.status !== 'waiting') {
            throw new Error('Game is not available to join');
        }
        match.players.push({
            user: new mongoose_2.Schema.Types.ObjectId(userId),
            color: 'black'
        });
        match.status = 'active';
        await match.save();
        return match;
    }
    static async makeMove(gameId, userId, move) {
        const match = await match_model_1.default.findById(gameId);
        if (!match) {
            throw new Error('Game not found');
        }
        if (match.status !== 'active') {
            throw new Error('Game is not active');
        }
        // Validate it's the player's turn
        if (match.gameState.currentTurn !== userId) {
            throw new Error('Not your turn');
        }
        // Make the move based on game type
        // switch (match.gameType) {
        //   case 'chess':
        //     const chess = new Chess(match.gameState.board.fen());
        //     const result = chess.move(move);
        //     if (!result) {
        //       throw new Error('Invalid move');
        //     }
        //     match.gameState.board = chess;
        //     break;
        //   // Add other game types here
        //   default:
        //     throw new Error('Unsupported game type');
        // }
        // Update game state
        match.gameState.moves.push({ ...move, player: userId });
        const nextPlayer = match.players.find(p => p.user.toString() !== userId);
        match.gameState.currentTurn = nextPlayer?.user.toString() || '';
        await match.save();
        return match;
    }
    static async resignGame(gameId, userId) {
        const match = await match_model_1.default.findById(gameId);
        if (!match) {
            throw new Error('Game not found');
        }
        if (match.status !== 'active') {
            throw new Error('Game is not active');
        }
        match.status = 'completed';
        match.winner = match.players.find(p => p.user.toString() !== userId)?.user;
        await match.save();
        return match;
    }
    static async getActiveGames(userId) {
        return match_model_1.default.find({
            'players.user': new mongoose_1.default.Types.ObjectId(userId),
            status: 'active'
        }).populate('players.user');
    }
    static async getGameHistory(userId) {
        return match_model_1.default.find({
            'players.user': new mongoose_1.default.Types.ObjectId(userId),
            status: 'completed'
        }).populate('players.user');
    }
}
exports.GameService = GameService;
