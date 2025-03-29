const Game = require("../models/game.model");
const User = require("../models/user.model");

// Create a new game
exports.createGame = async (req, res) => {
  try {
    const { gameType } = req.body;

    const newGame = new Game({
      gameType,
      players: [
        {
          user: req.userId,
          color: gameType === "chess" ? "white" : "X",
        },
      ],
      gameData:
        gameType === "chess"
          ? {
              boardState:
                "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
            } // Initial FEN for chess
          : { board: Array(9).fill(null) }, // Initial board for tic-tac-toe
    });

    await newGame.save();
    res.status(201).json(newGame);
  } catch (error) {
    console.error("Create game error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Join an existing game
exports.joinGame = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId);
    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (game.status !== "waiting") {
      return res.status(400).json({ message: "Game is no longer available" });
    }

    if (game.players.length >= 2) {
      return res.status(400).json({ message: "Game is full" });
    }

    // Add second player
    game.players.push({
      user: req.userId,
      color: game.gameType === "chess" ? "black" : "O",
    });

    game.status = "active";
    game.startTime = new Date();

    await game.save();
    res.json(game);
  } catch (error) {
    console.error("Join game error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get available games
exports.getAvailableGames = async (req, res) => {
  try {
    const games = await Game.find({
      status: "waiting",
      "players.user": { $ne: req.userId },
    }).populate("players.user", "username");

    res.json(games);
  } catch (error) {
    console.error("Get available games error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get user's active games
exports.getUserGames = async (req, res) => {
  try {
    const games = await Game.find({
      "players.user": req.userId,
      status: { $in: ["waiting", "active"] },
    }).populate("players.user", "username");

    res.json(games);
  } catch (error) {
    console.error("Get user games error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get game by ID
exports.getGameById = async (req, res) => {
  try {
    const { gameId } = req.params;

    const game = await Game.findById(gameId)
      .populate("players.user", "username")
      .populate("winner", "username");

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    res.json(game);
  } catch (error) {
    console.error("Get game error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
