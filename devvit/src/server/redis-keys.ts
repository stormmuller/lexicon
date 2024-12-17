export const leaderboardKey = (postId: string) => `leaderboard:${postId}`;

export const userTilesKey = (postId: string, userId: string) =>
  `user-tiles:${postId}:${userId}`;

export const userWordHistoryKey = (postId: string, userId: string) =>
  `user-word-history:${postId}:${userId}`;
