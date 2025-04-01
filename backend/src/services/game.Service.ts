import { Types } from "mongoose";
import mongoose from "mongoose";
import { Match, IMatch } from "../models/match.model";
import { GameType, IGameState } from "../types/game.types";
import { TicTacToe } from "../utils/gameLogic/tictactoe";
// Uncomment when implemented
// import { Chess } from '../utils/gameLogic/chess';
// import { Checkers } from '../utils/gameLogic/checkers';

interface MoveResult {
  board: (string | null)[];
  winner: string | null;
  draw?: boolean;
}

export class GameService {
  /**
   * Get the game logic based on game type
   */
  private static getGameLogic(type: GameType) {
    switch (type) {
      case "tic-tac-toe":
        return new TicTacToe();
      case "chess":
        // Temporarily throw error until Chess is implemented
        throw new Error("Chess game logic not yet implemented");
      // return new Chess();
      default:
        throw new Error(`Unsupported game type: ${type}`);
    }
  }

  /**
   * Create a new game match
   */
  static async createGame(
    gameType: GameType,
    userId: string,
    opponentId?: string
  ): Promise<IMatch> {
    // Define initial board based on game type
    let initialBoard = null;
    let color = "";

    if (gameType === "chess") {
      initialBoard = Array(8)
        .fill(null)
        .map(() => Array(8).fill(null));
      color = "white";
    } else if (gameType === "tic-tac-toe") {
      initialBoard = Array(9).fill(null);
      color = "X";
    } else {
      throw new Error(`Unsupported game type: ${gameType}`);
    }

    // Create players array with the creator
    const players = [
      {
        user: new Types.ObjectId(userId),
        color,
        score: 0,
        winner: false,
      },
    ];

    // Add opponent if specified
    if (opponentId) {
      players.push({
        user: new Types.ObjectId(opponentId),
        color: gameType === "chess" ? "black" : "O",
        score: 0,
        winner: false,
      });
    }

    // Create the game object
    const game = {
      type: gameType,
      players: {} as Record<string, string>,
    };

    // Set player mapping in game.players object
    game.players[color] = userId;
    if (opponentId) {
      game.players[gameType === "chess" ? "black" : "O"] = opponentId;
    }

    // Create game state
    const gameState = {
      board: initialBoard,
      currentPlayer: userId,
      status: "active",
      moves: [],
    };

    // Create and save the match
    const match = await Match.create({
      game,
      gameState,
      players,
      status: opponentId ? "active" : "pending",
      startTime: new Date(),
    });

    return match;
  }

  /**
   * Get all games for a user
   */
  static async getGames(userId: string): Promise<IMatch[]> {
    return Match.find({
      "players.user": new Types.ObjectId(userId),
    }).populate("players.user");
  }

  /**
   * Get a specific game by ID
   */
  static async getGameById(gameId: string): Promise<IMatch | null> {
    return Match.findById(gameId).populate("players.user");
  }

  /**
   * Join an existing game
   */
  static async joinMatch(matchId: string, userId: string): Promise<IMatch> {
    const match = await Match.findById(matchId);
    if (!match) {
      throw new Error("Game not found");
    }

    if (match.status !== "pending") {
      throw new Error("Game is not available to join");
    }

    if (match.players.length >= 2) {
      throw new Error("Game is already full");
    }

    // Determine player color/symbol based on game type
    const playerColor = match.game.type === "chess" ? "black" : "O";

    // Add player to the match
    match.players.push({
      user: new Types.ObjectId(userId),
      color: playerColor,
      score: 0,
      winner: false,
    });

    // Update game state
    match.status = "active";
    match.game.players[playerColor] = userId;

    await match.save();
    return match;
  }

  /**
   * Make a move in the game
   */
  static async makeMove(
    matchId: string,
    userId: string,
    move: any
  ): Promise<IMatch> {
    const match = await Match.findById(matchId);
    if (!match) {
      throw new Error("Game not found");
    }

    if (match.status !== "active") {
      throw new Error("Game is not active");
    }

    // Validate it's the player's turn
    if (match.gameState.currentPlayer !== userId) {
      throw new Error("Not your turn");
    }

    // Find opponent
    const playerIndex = match.players.findIndex(
      (p) => p.user.toString() === userId
    );
    if (playerIndex === -1) {
      throw new Error("Player not found in this match");
    }

    const opponentIndex = playerIndex === 0 ? 1 : 0;
    if (opponentIndex >= match.players.length) {
      throw new Error("Opponent not found");
    }

    const opponentId = match.players[opponentIndex].user.toString();

    // Add move to history
    if (!match.gameState.moves) {
      match.gameState.moves = [];
    }

    match.gameState.moves.push({
      player: userId,
      move,
      timestamp: new Date(),
    });

    try {
      // Get game logic based on game type
      const gameLogic = this.getGameLogic(match.game.type);

      // Make the move and get updated game state
      const result = gameLogic.makeMove(match.gameState.board, {
        ...move,
        player: userId,
      }) as MoveResult;

      // Update game state
      match.gameState.board = result.board;

      // Check for game over conditions
      if (result.winner) {
        match.status = "completed";
        match.gameState.status = "completed";
        match.winner = userId;

        // Update player stats
        const winnerPlayer = match.players.find(
          (p) => p.user.toString() === userId
        );
        if (winnerPlayer) {
          winnerPlayer.winner = true;
          winnerPlayer.score = (winnerPlayer.score || 0) + 1;
        }

        match.endTime = new Date();
      } else if (result.draw) {
        match.status = "completed";
        match.gameState.status = "draw";
        match.endTime = new Date();
      } else {
        // Switch turns to the other player
        match.gameState.currentPlayer = opponentId;
      }
    } catch (error) {
      throw new Error(`Failed to process move: ${(error as Error).message}`);
    }

    await match.save();
    return match;
  }

  /**
   * Forfeit/resign from a game
   */
  static async forfeitMatch(matchId: string, userId: string): Promise<IMatch> {
    const match = await Match.findById(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    if (match.status !== "active") {
      throw new Error("Match is not active");
    }

    // Find the resigning player
    const player = match.players.find((p) => p.user.toString() === userId);
    if (!player) {
      throw new Error("Player not found in match");
    }

    // Find the opponent and mark as winner
    const otherPlayer = match.players.find((p) => p.user.toString() !== userId);
    if (otherPlayer) {
      otherPlayer.winner = true;
      otherPlayer.score = (otherPlayer.score || 0) + 1;
      match.winner = otherPlayer.user.toString();
    }

    // Mark game as completed
    match.status = "completed";
    match.gameState.status = "completed";
    match.endTime = new Date();

    await match.save();
    return match;
  }

  /**
   * Get active games for a user
   */
  static async getActiveGames(userId: string): Promise<IMatch[]> {
    return Match.find({
      "players.user": new Types.ObjectId(userId),
      status: "active",
    }).populate("players.user");
  }

  /**
   * Get completed games for a user
   */
  static async getGameHistory(userId: string): Promise<IMatch[]> {
    return Match.find({
      "players.user": new Types.ObjectId(userId),
      status: "completed",
    }).populate("players.user");
  }

  /**
   * Offer a draw in the game
   */
  static async offerDraw(matchId: string, userId: string): Promise<IMatch> {
    const match = await Match.findById(matchId);
    if (!match) {
      throw new Error("Match not found");
    }

    if (match.status !== "active") {
      throw new Error("Match is not active");
    }

    const player = match.players.find((p) => p.user.toString() === userId);
    if (!player) {
      throw new Error("Player not found in match");
    }

    // In a real implementation, we would need to handle the draw offer through the socket connection
    // and wait for the other player to accept or reject it
    // For now, we'll just mark the draw offer in the match
    const gameState = match.gameState as IGameState & { drawOffer?: string };
    if (!gameState.drawOffer) {
      gameState.drawOffer = userId;
    } else if (gameState.drawOffer !== userId) {
      // Both players have offered a draw
      match.status = "completed";
      match.gameState.status = "draw";
      match.endTime = new Date();
    }

    await match.save();
    return match;
  }
}

// Create a singleton instance for export
export const gameService = new GameService();
