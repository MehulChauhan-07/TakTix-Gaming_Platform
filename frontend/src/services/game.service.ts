import { api } from "./api";
import { GameState, GameType } from "../types/game.types";

export class GameService {
  static async createGame(gameType: string, opponentId: string) {
    const response = await api.post("/games/create", {
      gameType,
      opponentId,
    });
    return response.data;
  }

  static async getGame(gameId: string) {
    const response = await api.get(`/games/${gameId}`);
    return response.data;
  }

  static async makeMove(gameId: string, move: any) {
    const response = await api.post(`/games/${gameId}/move`, move);
    return response.data;
  }

  static async getActiveGames() {
    const response = await api.get("/games/active");
    return response.data;
  }

  static async getCompletedGames() {
    const response = await api.get("/games/history");
    return response.data;
  }
}
