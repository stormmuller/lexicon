import { RedisClient } from "@devvit/public-api";
import {
  ChainCompleteRpcRequest,
  ChainCompleteRpcResponse,
  rpc_chainComplete,
} from "@lexicon/common";
import { Rpc, RpcHandler } from "../../rpc/rpc-handler.ts";
import { wordsKeyName } from "../cache-words.ts";
import { calculateWordScore } from "../calculate-word-score.ts";
import { getBoard } from "../get-board.ts";
import { configuration } from "../../configuration.ts";
import { validateTile } from "../validate-tile.ts";
import { getLeaderboard } from "../get-leaderboard.ts";

export type ChainCompleteMessage = Rpc<ChainCompleteRpcRequest>;

export class ChainCompleteMessageHandler extends RpcHandler<
  ChainCompleteMessage,
  ChainCompleteRpcResponse
> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(rpc_chainComplete);

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
        throw new Error("Invalid tile!");
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

    const leaderboard = await getLeaderboard(postId, username, this._redis);

    return { word, score: wordScore, leaderboard };
  }
}
