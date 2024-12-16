import { RedisClient } from "@devvit/public-api";
import {
  ChainCompleteRpcRequest,
  ChainCompleteRpcResponse,
  LeaderboardEntry,
} from "@lexicon/common";
import { Rpc, RpcHandler } from "../../rpc/rpc-handler.ts";
import { wordsKeyName } from "../cache-words.ts";
import { calculateWordScore } from "../calculate-word-score.ts";
import { getBoard } from "../get-board.ts";
import { configuration } from "../../configuration.ts";
import { validateTile } from "../validate-tile.ts";

export type ChainCompleteMessage = Rpc<ChainCompleteRpcRequest>;
export const chainCompleteMessageType = "chain-complete";

export class ChainCompleteMessageHandler extends RpcHandler<
  ChainCompleteMessage,
  ChainCompleteRpcResponse
> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(chainCompleteMessageType);

    this._redis = redis;
  }

  public override async handle(message: ChainCompleteMessage) {
    let { data, postId, username } = message;
    const { tiles } = data;
    const leaderboardKey = `leaderboard:${postId}`;

    const board = await getBoard(this._redis, postId);

    if (!board) {
      throw new Error(`No board exists for this post! postId: ${postId}`);
    }

    let word = "";

    for (const tile of tiles) {
      const isValidTile = validateTile(tile);

      if (!isValidTile) {
        throw new Error('Invalid tile!');
      }

      const boardIndex = tile.x + tile.y * configuration.boardDimentions.x;
      const sanitizedLetter = board[boardIndex].toLowerCase();
      word += sanitizedLetter;
    }

    const wordRank = await this._redis.zRank(wordsKeyName, word);
    const isValidWord = wordRank !== undefined;
    const wordScore = isValidWord ? calculateWordScore(word) : 0;

    let userScore = (await this._redis.zScore(leaderboardKey, username)) || 0;
    userScore += wordScore;

    await this._redis.zAdd(leaderboardKey, {
      member: username,
      score: userScore,
    });

    const rank = (await this._redis.zRank(leaderboardKey, username)) || 0;
    const card = await this._redis.zCard(leaderboardKey);
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
    const leaderboard = await this._redis.zRange(leaderboardKey, start, stop, {
      by: "rank",
      reverse: true,
    });

    const rankedLeaderboard = this._rankLeaderboard(
      leaderboard,
      username,
      revRank
    );

    return { word, score: wordScore, leaderboard: rankedLeaderboard };
  }

  private _rankLeaderboard(
    leaderboard: {
      member: string;
      score: number;
    }[],
    username: string,
    userRank: number
  ) {
    const userIndex = leaderboard.findIndex(
      (entry) => entry.member === username
    );

    if (userIndex === -1) throw new Error("User not found in leaderboard");

    const rankOffset = userRank - (userIndex + 1);

    const updatedLeaderboard = leaderboard.map((entry, index) => ({
      rank: index + 1 + rankOffset,
      username: entry.member,
      score: entry.score,
    }));

    return updatedLeaderboard;
  }
}
