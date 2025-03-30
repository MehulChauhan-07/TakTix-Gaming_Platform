import { Game } from '../models/game.model';
import { GameState, GameType, GameStatus } from '../types/game.types';
import { TicTacToe } from '../utils/gameLogic/tictactoe';
// import { Chess } from '../utils/gameLogic/chess';
// import { Checkers } from '../utils/gameLogic/checkers';
import Match, { IMatch } from '../models/match.model';
import mongoose from 'mongoose';
import { Schema } from 'mongoose';

export class GameService {
  private static getGameLogic(type: GameType) {
    switch (type) {
      case 'tictactoe':
        return new TicTacToe();
      // case 'chess':
      //   return new Chess();
      // case 'checkers':
      //   return new Checkers();
      default:
        throw new Error(`Unsupported game type: ${type}`);
    }
  }

  static async createGame(userId: string, gameType: string, opponentId?: string): Promise<IMatch> {
    const match = new Match({
      gameType,
      players: [
        {
          user: new Schema.Types.ObjectId(userId),
          color: 'white'
        }
      ],
      status: opponentId ? 'pending' : 'waiting'
    });

    if (opponentId) {
      match.players.push({
        user: new Schema.Types.ObjectId(opponentId),
        color: 'black'
      });
    }

    await match.save();
    return match;
  }

  static async getGame(gameId: string): Promise<IMatch | null> {
    return Match.findById(gameId).populate('players.user');
  }

  static async getGames(userId: string): Promise<IMatch[]> {
    return Match.find({
      'players.user': new mongoose.Types.ObjectId(userId)
    }).populate('players.user');
  }

  static async getGameById(gameId: string): Promise<IMatch | null> {
    return Match.findById(gameId).populate('players.user');
  }

  static async joinGame(gameId: string, userId: string): Promise<IMatch> {
    const match = await Match.findById(gameId);
    if (!match) {
      throw new Error('Game not found');
    }

    if (match.status !== 'waiting') {
      throw new Error('Game is not available to join');
    }

    match.players.push({
      user: new Schema.Types.ObjectId(userId),
      color: 'black'
    });
    match.status = 'active';

    await match.save();
    return match;
  }

  static async makeMove(gameId: string, userId: string, move: any): Promise<IMatch> {
    const match = await Match.findById(gameId);
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

  static async resignGame(gameId: string, userId: string): Promise<IMatch> {
    const match = await Match.findById(gameId);
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

  static async getActiveGames(userId: string): Promise<IMatch[]> {
    return Match.find({
      'players.user': new mongoose.Types.ObjectId(userId),
      status: 'active'
    }).populate('players.user');
  }

  static async getGameHistory(userId: string): Promise<IMatch[]> {
    return Match.find({
      'players.user': new mongoose.Types.ObjectId(userId),
      status: 'completed'
    }).populate('players.user');
  }
}
