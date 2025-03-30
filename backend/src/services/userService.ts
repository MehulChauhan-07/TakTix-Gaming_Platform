import User from '../models/user.model';

export type GameResult = 'win' | 'loss' | 'draw';

export const updateUserStats = async (userId: string, result: GameResult): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // Update stats based on game result
  user.stats.gamesPlayed += 1;
  switch (result) {
    case 'win':
      user.stats.gamesWon += 1;
      user.rating += 25; // Simple rating adjustment
      break;
    case 'loss':
      user.stats.gamesLost += 1;
      user.rating = Math.max(0, user.rating - 20); // Prevent negative rating
      break;
    case 'draw':
      user.stats.gamesDraw += 1;
      user.rating += 5; // Small rating increase for draws
      break;
  }

  await user.save();
}; 