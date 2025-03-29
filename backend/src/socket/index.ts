import { Server, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import User from "../models/User";
import Match from "../models/Match";

// Game-specific handlers
import handleChessEvents from "./handlers/chessHandler";
import handleTicTacToeEvents from "./handlers/ticTacToeHandler";

interface AuthenticatedSocket extends Socket {
  userId?: string;
  username?: string;
}

export default function initializeSocket(io: Server) {
  // Middleware to authenticate socket connections
  io.use(async (socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
      return next(new Error("Authentication error"));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || "your-secret-key"
      ) as { id: string };

      const user = await User.findById(decoded.id);

      if (!user) {
        return next(new Error("User not found"));
      }

      socket.userId = user._id.toString();
      socket.username = user.username;
      next();
    } catch (error) {
      next(new Error("Authentication error"));
    }
  });

  // Connection event
  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`User connected: ${socket.username} (${socket.userId})`);

    // Join user to their personal room
    socket.join(`user:${socket.userId}`);

    // Handle matchmaking
    socket.on("join-matchmaking", async (gameId: string) => {
      try {
        // Find waiting matches for this game
        const waitingMatch = await Match.findOne({
          game: gameId,
          status: "waiting",
          "players.1": { $exists: false }, // Only one player in the match
        });

        if (waitingMatch) {
          // Join existing match
          waitingMatch.players.push({
            user: socket.userId,
            score: 0,
            winner: false,
          });
          waitingMatch.status = "active";
          waitingMatch.startedAt = new Date();
          await waitingMatch.save();

          // Notify both players
          io.to(`match:${waitingMatch._id}`).emit(
            "match-started",
            waitingMatch._id
          );
          socket.join(`match:${waitingMatch._id}`);

          // Notify match creator
          io.to(`user:${waitingMatch.players[0].user}`).emit(
            "opponent-joined",
            {
              matchId: waitingMatch._id,
              opponent: socket.username,
            }
          );

          // Notify the player who just joined
          socket.emit("match-joined", {
            matchId: waitingMatch._id,
            opponent: await User.findById(waitingMatch.players[0].user).select(
              "username profilePicture"
            ),
          });
        } else {
          // Create new match
          const newMatch = new Match({
            game: gameId,
            players: [
              {
                user: socket.userId,
                score: 0,
                winner: false,
              },
            ],
            status: "waiting",
            gameState: {},
          });

          await newMatch.save();

          // Join match room
          socket.join(`match:${newMatch._id}`);

          // Notify player
          socket.emit("waiting-for-opponent", newMatch._id);
        }
      } catch (error) {
        console.error("Join matchmaking error:", error);
        socket.emit("matchmaking-error", "Failed to join matchmaking");
      }
    });

    // Handle game-specific events
    socket.on("join-game", async (matchId: string) => {
      try {
        const match = await Match.findById(matchId).populate("game");

        if (!match) {
          return socket.emit("error", "Match not found");
        }

        // Join match room
        socket.join(`match:${matchId}`);

        // Route to game-specific handlers based on game type
        switch ((match.game as any).slug) {
          case "chess":
            handleChessEvents(io, socket, match);
            break;
          case "tic-tac-toe":
            handleTicTacToeEvents(io, socket, match);
            break;
          default:
            socket.emit("error", "Unsupported game type");
        }
      } catch (error) {
        console.error("Join game error:", error);
        socket.emit("error", "Failed to join game");
      }
    });

    // Handle spectating
    socket.on("spectate", async (matchId: string) => {
      try {
        const match = await Match.findById(matchId);

        if (!match) {
          return socket.emit("error", "Match not found");
        }

        // Add user to spectators if not already there
        if (!match.spectators.includes(socket.userId)) {
          match.spectators.push(socket.userId);
          await match.save();
        }

        // Join match room as spectator
        socket.join(`match:${matchId}:spectators`);

        // Send current game state
        socket.emit("game-state", match.gameState);

        // Notify players of new spectator
        io.to(`match:${matchId}`).emit("spectator-joined", socket.username);
      } catch (error) {
        console.error("Spectate error:", error);
        socket.emit("error", "Failed to spectate game");
      }
    });

    // In-game chat
    socket.on("send-message", async (matchId: string, message: string) => {
      try {
        const match = await Match.findById(matchId);

        if (!match) {
          return socket.emit("error", "Match not found");
        }

        // Add message to match
        match.messages.push({
          user: socket.userId,
          message,
          timestamp: new Date(),
        });

        await match.save();

        // Broadcast message to all users in the match
        io.to(`match:${matchId}`)
          .to(`match:${matchId}:spectators`)
          .emit("new-message", {
            username: socket.username,
            message,
            timestamp: new Date(),
          });
      } catch (error) {
        console.error("Send message error:", error);
        socket.emit("error", "Failed to send message");
      }
    });

    // Disconnect event
    socket.on("disconnect", () => {
      console.log(`User disconnected: ${socket.username} (${socket.userId})`);
    });
  });
}
