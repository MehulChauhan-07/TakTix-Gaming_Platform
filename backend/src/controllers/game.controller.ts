import { Request, Response } from 'express';
import { GameService } from '../services/game.Service';
import { AppError } from '../middleware/errorMiddleware';

export const createGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameType, opponent } = req.body;
    const game = await GameService.createGame(req.user!.id, gameType, opponent);
    res.status(201).json({ status: 'success', data: game });
  } catch (error) {
    console.error('Error creating game:', error);
    res.status(500).json({ status: 'error', message: 'Error creating game' });
  }
};

export const getGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await GameService.getGames(req.user!.id);
    res.status(200).json({ status: 'success', data: games });
  } catch (error) {
    console.error('Error getting games:', error);
    res.status(500).json({ status: 'error', message: 'Error getting games' });
  }
};

export const getGameById = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await GameService.getGameById(req.params.gameId);
    if (!game) {
      res.status(404).json({ status: 'error', message: 'Game not found' });
      return;
    }
    res.status(200).json({ status: 'success', data: game });
  } catch (error) {
    console.error('Error getting game:', error);
    res.status(500).json({ status: 'error', message: 'Error getting game' });
  }
};

export const joinGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await GameService.joinGame(req.params.gameId, req.user!.id);
    res.status(200).json({ status: 'success', data: game });
  } catch (error) {
    console.error('Error joining game:', error);
    res.status(500).json({ status: 'error', message: 'Error joining game' });
  }
};

export const makeMove = async (req: Request, res: Response): Promise<void> => {
  try {
    const { move } = req.body;
    const game = await GameService.makeMove(req.params.gameId, req.user!.id, move);
    res.status(200).json({ status: 'success', data: game });
  } catch (error) {
    console.error('Error making move:', error);
    res.status(500).json({ status: 'error', message: 'Error making move' });
  }
};

export const resignGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const game = await GameService.resignGame(req.params.gameId, req.user!.id);
    res.status(200).json({ status: 'success', data: game });
  } catch (error) {
    console.error('Error resigning game:', error);
    res.status(500).json({ status: 'error', message: 'Error resigning game' });
  }
};

export const getActiveGames = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await GameService.getActiveGames(req.params.playerId);
    res.status(200).json({ status: 'success', data: games });
  } catch (error) {
    console.error('Error getting active games:', error);
    res.status(500).json({ status: 'error', message: 'Error getting active games' });
  }
};

export const getGameHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const games = await GameService.getGameHistory(req.params.playerId);
    res.status(200).json({ status: 'success', data: games });
  } catch (error) {
    console.error('Error getting game history:', error);
    res.status(500).json({ status: 'error', message: 'Error getting game history' });
  }
};
