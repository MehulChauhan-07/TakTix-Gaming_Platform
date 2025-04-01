import { Server } from "socket.io";
import { AuthenticatedSocket, DeviceCheckData } from "../types/socket.types";
import handleTicTacToeEvents from "./handler/ticTacToeHandler";
import handleChessEvents from "./handler/chessHandler";
import { deviceAuthService } from "../services/deviceAuth.service";
import {
  Match,
  IMatch,
  ChessMatch,
  TicTacToeMatch,
} from "../models/match.model";
import mongoose from "mongoose";

const isChessMatch = (
  match: IMatch & { _id: string | mongoose.Types.ObjectId }
): match is ChessMatch & { _id: mongoose.Types.ObjectId } => {
  return match.game.type === "chess";
};

const isTicTacToeMatch = (
  match: IMatch & { _id: string | mongoose.Types.ObjectId }
): match is TicTacToeMatch & { _id: mongoose.Types.ObjectId } => {
  return match.game.type === "tic-tac-toe";
};

export const initializeSocket = (io: Server) => {
  deviceAuthService.setIo(io);

  io.on("connection", async (socket: AuthenticatedSocket) => {
    console.log("Client connected:", socket.id);

    socket.on("auth:device:check", (data: DeviceCheckData) => {
      const isValid = deviceAuthService.handleDeviceCheck(socket, data);
      if (!isValid) {
        // The connection will be handled by the client when it receives the force logout event
        return;
      }
    });

    socket.on("join-game", async (matchId: string) => {
      try {
        const matchDoc = await Match.findById(matchId).populate("game").lean();
        if (!matchDoc) {
          socket.emit("error", "Match not found");
          return;
        }

        const match = {
          ...matchDoc,
          _id: new mongoose.Types.ObjectId(matchDoc._id.toString()),
        } as unknown as IMatch & { _id: mongoose.Types.ObjectId };

        socket.join(matchId);
        io.to(matchId).emit(
          "game:playerCount",
          io.sockets.adapter.rooms.get(matchId)?.size || 0
        );

        // Handle game-specific events based on game type
        if (isChessMatch(match)) {
          handleChessEvents(io, socket, match);
        } else if (isTicTacToeMatch(match)) {
          handleTicTacToeEvents(io, socket, match);
        } else {
          socket.emit("error", "Unsupported game type");
        }
      } catch (error) {
        console.error("Error joining game:", error);
        socket.emit("error", "Failed to join game");
      }
    });

    socket.on("leave-game", (matchId: string) => {
      socket.leave(matchId);
      io.to(matchId).emit(
        "game:playerCount",
        io.sockets.adapter.rooms.get(matchId)?.size || 0
      );
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
      if (socket.data.userId) {
        deviceAuthService.removeSession(socket.data.userId);
      }
    });
  });
};
