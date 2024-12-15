import { RedisClient } from "@devvit/public-api";
import {
  ChainCompleteRpcRequest,
  ChainCompleteRpcResponse,
} from "@gameup/rpc-types";
import { Rpc, RpcHandler } from "../../src/rpc/rpc-handler.ts";
import { wordsKeyName } from "../cache-words.ts";
import { calculateWordScore } from "../calculate-word-score.ts";
import { getBoard } from "../get-board.ts";
import { configuration } from "../../src/configuration.ts";

export type ChainCompleteMessage = Rpc<ChainCompleteRpcRequest>;
export const chainCompleteMessageType = "chain-complete";
export const leaderboardKey = "leaderboard";
const numberOfPlayersOnLeaderBoardBefore = 2;
const numberOfPlayersOnLeaderBoardAfter = 2;

export class ChainCompleteMessageHandler extends RpcHandler<
  ChainCompleteMessage,
  ChainCompleteRpcResponse
> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(chainCompleteMessageType);

    this._redis = redis;
  }

  private _buildLeaderBoard(
    lowerUsers: { member: string; score: number }[],
    higherUsers: { member: string; score: number }[],
    username: string,
    score: number,
    rank: number
  ) {
    let leaderboard = new Array<{
      username: string;
      score: number;
      rank: number;
    }>();


    for (let i = higherUsers.length; i > 0; i--) {
      const lowUser = higherUsers[i];
      leaderboard.push({
        username: lowUser.member,
        score: lowUser.score,
        rank: rank - i - 1,
      });
    }

    leaderboard.push({ username, score, rank });

    for (let i = 0; i < lowerUsers.length; i++) {
      const lowUser = lowerUsers[i];
      leaderboard.push({
        username: lowUser.member,
        score: lowUser.score,
        rank: rank + i + 1,
      });
    }

    return leaderboard;
  }

  public override async handle(message: ChainCompleteMessage) {
    const { data, postId, username } = message;
    const { tiles } = data;

    const board = await getBoard(this._redis, postId);

    if (!board) {
      throw new Error(`No board exists for this post! postId: ${postId}`);
    }

    let word = "";

    for (const tile of tiles) {
      // TODO: validate tile is in bounds of board
      const boardIndex = tile.x + tile.y * configuration.boardDimentions.x;
      const sanitizedLetter = board[boardIndex].toLowerCase();
      word += sanitizedLetter;
    }

    const wordRank = await this._redis.zRank(wordsKeyName, word);

    const isValidWord = wordRank !== undefined;

    if (!isValidWord) {
      return { word, score: 0, leaderboard: [] };
    }

    const wordScore = calculateWordScore(word);

    let userScore = await this._redis.zScore(leaderboardKey, username) || 0;
    userScore += wordScore;

    await this._redis.zAdd("leaderboard", {
      member: username,
      score: userScore,
    });

    const rank = await this._redis.zRank(leaderboardKey, username);

    if (rank === null || rank === undefined) {
      throw new Error(`User ${username} does not exist in the leaderboard.`);
    }

    // Get two users lower (ensure bounds are valid)
    const lowerBound = Math.max(rank - numberOfPlayersOnLeaderBoardBefore, 0);
    const lowerUsers = await this._redis.zRange(
      leaderboardKey,
      lowerBound,
      rank - 1
    );

    // Get two users higher (ensure bounds are valid)
    const higherUsers = await this._redis.zRange(
      leaderboardKey,
      rank + 1,
      rank + numberOfPlayersOnLeaderBoardAfter
    );

    const leaderboard = this._buildLeaderBoard(lowerUsers, higherUsers, username, userScore, rank);

    return { word, score: wordScore, leaderboard };
  }
}
