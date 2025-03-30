"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getGameHistory = exports.getActiveGames = exports.resignGame = exports.makeMove = exports.joinGame = exports.getGameById = exports.getGames = exports.createGame = void 0;
const game_Service_1 = require("../services/game.Service");
const createGame = async (req, res) => {
    try {
        const { gameType, opponent } = req.body;
        const game = await game_Service_1.GameService.createGame(req.user.id, gameType, opponent);
        res.status(201).json({ status: 'success', data: game });
    }
    catch (error) {
        console.error('Error creating game:', error);
        res.status(500).json({ status: 'error', message: 'Error creating game' });
    }
};
exports.createGame = createGame;
const getGames = async (req, res) => {
    try {
        const games = await game_Service_1.GameService.getGames(req.user.id);
        res.status(200).json({ status: 'success', data: games });
    }
    catch (error) {
        console.error('Error getting games:', error);
        res.status(500).json({ status: 'error', message: 'Error getting games' });
    }
};
exports.getGames = getGames;
const getGameById = async (req, res) => {
    try {
        const game = await game_Service_1.GameService.getGameById(req.params.gameId);
        if (!game) {
            res.status(404).json({ status: 'error', message: 'Game not found' });
            return;
        }
        res.status(200).json({ status: 'success', data: game });
    }
    catch (error) {
        console.error('Error getting game:', error);
        res.status(500).json({ status: 'error', message: 'Error getting game' });
    }
};
exports.getGameById = getGameById;
const joinGame = async (req, res) => {
    try {
        const game = await game_Service_1.GameService.joinGame(req.params.gameId, req.user.id);
        res.status(200).json({ status: 'success', data: game });
    }
    catch (error) {
        console.error('Error joining game:', error);
        res.status(500).json({ status: 'error', message: 'Error joining game' });
    }
};
exports.joinGame = joinGame;
const makeMove = async (req, res) => {
    try {
        const { move } = req.body;
        const game = await game_Service_1.GameService.makeMove(req.params.gameId, req.user.id, move);
        res.status(200).json({ status: 'success', data: game });
    }
    catch (error) {
        console.error('Error making move:', error);
        res.status(500).json({ status: 'error', message: 'Error making move' });
    }
};
exports.makeMove = makeMove;
const resignGame = async (req, res) => {
    try {
        const game = await game_Service_1.GameService.resignGame(req.params.gameId, req.user.id);
        res.status(200).json({ status: 'success', data: game });
    }
    catch (error) {
        console.error('Error resigning game:', error);
        res.status(500).json({ status: 'error', message: 'Error resigning game' });
    }
};
exports.resignGame = resignGame;
const getActiveGames = async (req, res) => {
    try {
        const games = await game_Service_1.GameService.getActiveGames(req.params.playerId);
        res.status(200).json({ status: 'success', data: games });
    }
    catch (error) {
        console.error('Error getting active games:', error);
        res.status(500).json({ status: 'error', message: 'Error getting active games' });
    }
};
exports.getActiveGames = getActiveGames;
const getGameHistory = async (req, res) => {
    try {
        const games = await game_Service_1.GameService.getGameHistory(req.params.playerId);
        res.status(200).json({ status: 'success', data: games });
    }
    catch (error) {
        console.error('Error getting game history:', error);
        res.status(500).json({ status: 'error', message: 'Error getting game history' });
    }
};
exports.getGameHistory = getGameHistory;
