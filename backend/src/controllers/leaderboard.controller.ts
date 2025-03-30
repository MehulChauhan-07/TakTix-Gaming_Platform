import { Request, Response } from 'express';
import User from '../models/user.model';
import { Game } from '../models/game.model';

// Get global leaderboard
export const getLeaderboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get top players based on rating
    const leaderboard = await User.find()
      .select('username profilePicture rating stats')
      .sort({ rating: -1 })
      .limit(100);

    res.status(200).json({
      status: 'success',
      data: leaderboard,
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch leaderboard',
    });
  }
};

// Get leaderboard by game type
export const getLeaderboardByGame = async (req: Request, res: Response): Promise<void> => {
  try {
    const { gameType } = req.params;

    // Validate game type
    if (!['tictactoe', 'chess', 'checkers'].includes(gameType)) {
      res.status(400).json({
        status: 'error',
        message: 'Invalid game type',
      });
      return;
    }

    // Get top players for specific game type using aggregation
    const leaderboard = await Game.aggregate([
      { $match: { type: gameType, status: 'completed' } },
      { $unwind: '$players' },
      {
        $group: {
          _id: '$players.id',
          username: { $first: '$players.username' },
          gamesPlayed: { $sum: 1 },
          wins: {
            $sum: {
              $cond: [{ $eq: ['$winner', '$players.id'] }, 1, 0],
            },
          },
        },
      },
      {
        $project: {
          username: 1,
          gamesPlayed: 1,
          wins: 1,
          winRate: {
            $round: [{ $multiply: [{ $divide: ['$wins', '$gamesPlayed'] }, 100] }, 1],
          },
        },
      },
      { $sort: { wins: -1, winRate: -1 } },
      { $limit: 50 },
    ]);

    res.status(200).json({
      status: 'success',
      data: leaderboard,
    });
  } catch (error) {
    console.error(`Error fetching ${req.params.gameType} leaderboard:`, error);
    res.status(500).json({
      status: 'error',
      message: 'Failed to fetch game leaderboard',
    });
  }
};