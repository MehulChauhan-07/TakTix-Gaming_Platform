import { Request, Response } from "express";
import { GameService } from "../services/game.Service";
import { AuthRequest } from "../types/auth.types";

export const gameController = {
  async createMatch(req: AuthRequest, res: Response) {
    try {
      const { gameType, opponentId } = req.body;
      if (!gameType || !opponentId) {
        res.status(400).json({
          message: "Missing required fields: gameType and opponentId",
        });
        return;
      }
      if (gameType !== "chess" && gameType !== "tic-tac-toe") {
        res.status(400).json({
          message: "Invalid game type. Must be 'chess' or 'tic-tac-toe'",
        });
        return;
      }
      const match = await GameService.createGame(
        gameType,
        req.user!.id,
        opponentId
      );
      res.status(201).json(match);
    } catch (error) {
      console.error("Error creating match:", error);
      res.status(500).json({ message: "Failed to create match" });
    }
  },

  async getGameById(req: Request, res: Response) {
    try {
      const game = await GameService.getGameById(req.params.gameId);
      if (!game) {
        res.status(404).json({ status: "error", message: "Game not found" });
        return;
      }
      res.status(200).json({ status: "success", data: game });
    } catch (error) {
      console.error("Error getting game:", error);
      res.status(500).json({ status: "error", message: "Error getting game" });
    }
  },

  async getActiveGames(req: AuthRequest, res: Response) {
    try {
      const games = await GameService.getActiveGames(req.user!.id);
      res.status(200).json({ status: "success", data: games });
    } catch (error) {
      console.error("Error getting active games:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error getting active games" });
    }
  },

  async getGameHistory(req: AuthRequest, res: Response) {
    try {
      const games = await GameService.getGameHistory(req.user!.id);
      res.status(200).json({ status: "success", data: games });
    } catch (error) {
      console.error("Error getting game history:", error);
      res
        .status(500)
        .json({ status: "error", message: "Error getting game history" });
    }
  },

  async joinMatch(req: AuthRequest, res: Response) {
    try {
      const game = await GameService.joinMatch(req.params.gameId, req.user!.id);
      res.status(200).json({ status: "success", data: game });
    } catch (error) {
      console.error("Error joining game:", error);
      res.status(500).json({ status: "error", message: "Error joining game" });
    }
  },

  async forfeitMatch(req: AuthRequest, res: Response) {
    try {
      const match = await GameService.forfeitMatch(
        req.params.matchId,
        req.user!.id
      );
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      console.error("Error forfeiting match:", error);
      res.status(500).json({ message: "Failed to forfeit match" });
    }
  },

  async offerDraw(req: AuthRequest, res: Response) {
    try {
      const match = await GameService.getGameById(req.params.matchId);
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      if (!match.players.includes(req.user!.id)) {
        return res
          .status(403)
          .json({ message: "You are not a player in this match" });
      }
      res.json({ message: "Draw offered" });
    } catch (error) {
      console.error("Error offering draw:", error);
      res.status(500).json({ message: "Failed to offer draw" });
    }
  },

  async acceptDraw(req: AuthRequest, res: Response) {
    try {
      const match = await GameService.forfeitMatch(
        req.params.matchId,
        req.user!.id
      );
      if (!match) {
        return res.status(404).json({ message: "Match not found" });
      }
      res.json(match);
    } catch (error) {
      console.error("Error accepting draw:", error);
      res.status(500).json({ message: "Failed to accept draw" });
    }
  },
};
