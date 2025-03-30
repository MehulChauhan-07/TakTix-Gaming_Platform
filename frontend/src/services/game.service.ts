import { api } from "./api";
import { GameState, GameType } from "../types/game.types";

export class GameService {
  static async createGame(type: GameType, players: any[]): Promise<GameState> {
    const response = await api.post("/games", { type, players });
    return response.data.data;
  }

  static async getGame(gameId: string): Promise<GameState> {
    const response = await api.get(`/games/${gameId}`);
    return response.data.data;
  }

  static async makeMove(
    gameId: string,
    playerId: string,
    move: any
  ): Promise<GameState> {
    const response = await api.post(`/games/${gameId}/move`, {
      playerId,
      move,
    });
    return response.data.data;
  }

  static async getActiveGames(playerId: string): Promise<GameState[]> {
    const response = await api.get(`/games/player/${playerId}/active`);
    return response.data.data;
  }

  static async getCompletedGames(playerId: string): Promise<GameState[]> {
    const response = await api.get(`/games/player/${playerId}/completed`);
    return response.data.data;
  }
}
