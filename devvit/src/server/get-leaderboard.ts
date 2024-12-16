import { RedisClient } from "@devvit/public-api";

export async function getLeaderboard(
  postId: string,
  username: string,
  redis: RedisClient
) {
  const leaderboardKey = `leaderboard:${postId}`;

  let userScore = (await redis.zScore(leaderboardKey, username)) || 0;

  await redis.zAdd(leaderboardKey, {
    member: username,
    score: userScore,
  });

  const rank = (await redis.zRank(leaderboardKey, username)) || 0;
  const card = await redis.zCard(leaderboardKey);
  const revRank = card - 1 - rank;

  if (rank === null || rank === undefined) {
    throw new Error(`User ${username} does not exist in the leaderboard.`);
  }

  let start = revRank - 2;
  let stop = revRank + 2;

  // If there are fewer than 5 total members, just return all of them
  if (card < 5) {
    start = 0;
    stop = card - 1;
  } else {
    // Adjust if our window goes beyond the top
    if (start < 0) {
      // Shift the window down
      stop = stop - start; // e.g., if start = -1, stop = stop + 1
      start = 0;
    }

    // Adjust if our window goes beyond the bottom
    if (stop > card - 1) {
      const diff = stop - (card - 1);
      start = start - diff;
      stop = card - 1;
    }

    // Double-check we still have 5 elements
    let count = stop - start + 1;
    if (count > 5) {
      // Trim excess if any
      stop = start + 4;
    }
  }

  // Fetch results with reverse = true so that index 0 = top score
  const leaderboard = await redis.zRange(leaderboardKey, start, stop, {
    by: "rank",
    reverse: true,
  });

  const rankedLeaderboard = rankLeaderboard(leaderboard, username, revRank);

  return rankedLeaderboard;
}

function rankLeaderboard(
  leaderboard: {
    member: string;
    score: number;
  }[],
  username: string,
  userRank: number
) {
  const userIndex = leaderboard.findIndex((entry) => entry.member === username);

  if (userIndex === -1) throw new Error("User not found in leaderboard");

  const rankOffset = userRank - (userIndex + 1);

  const updatedLeaderboard = leaderboard.map((entry, index) => ({
    rank: index + 1 + rankOffset,
    username: entry.member,
    score: entry.score,
  }));

  return updatedLeaderboard;
}
