import { RedisClient } from "@devvit/public-api";
import {
  ChainCompleteRpcRequest,
  ChainCompleteRpcResponse,
  rpc_chainComplete,
} from "@lexicon/common";
import { Rpc, RpcHandler } from "../rpc-handler.ts";
import { wordsKeyName } from "../../cache-words.ts";
import { calculateWordScore } from "../../calculate-word-score.ts";
import { getBoard } from "../../get-board.ts";
import { configuration } from "../../../configuration.ts";
import { validateTile } from "../../validate-tile.ts";
import { getLeaderboard } from "../../get-leaderboard.ts";
import { checkIfRepeatSelection } from "../../check-if-repeat-selection.ts";
import { saveTileSelection } from "../../save-tile-selection.ts";
import { saveWordHistory } from "../../save-word-history.ts";
import {
  leaderboardKey,
  userTilesKey,
  userWordHistoryKey,
} from "../../redis-keys.ts";

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

  public override async handle(
    message: ChainCompleteMessage
  ): Promise<ChainCompleteRpcResponse> {
    let { data, postId, username, userId } = message;
    const { tiles } = data;

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
      word += board[boardIndex];
    }

    word = word.toUpperCase();

    const wordRank = await this._redis.zRank(wordsKeyName, word.toLowerCase());
    const isInWordBank = wordRank !== undefined;

    if (!isInWordBank) {
      const leaderboard = await getLeaderboard(postId, username, this._redis);
      await saveWordHistory(
        userWordHistoryKey(postId, userId),
        word,
        0,
        "notfound",
        this._redis
      );
      return { word, score: 0, leaderboard, reason: "notfound" };
    }

    const isRepeatSelection = await checkIfRepeatSelection(
      userTilesKey(postId, userId),
      tiles,
      this._redis
    );

    if (isRepeatSelection) {
      const leaderboard = await getLeaderboard(postId, username, this._redis);
      await saveWordHistory(
        userWordHistoryKey(postId, userId),
        word,
        0,
        "repeat",
        this._redis
      );
      return { word, score: 0, leaderboard, reason: "repeat" };
    }

    await saveTileSelection(userTilesKey(postId, userId), tiles, this._redis);

    const wordScore = calculateWordScore(word);

    let userScore =
      (await this._redis.zScore(leaderboardKey(postId), username)) || 0;
    userScore += wordScore;

    await this._redis.zAdd(leaderboardKey(postId), {
      member: username,
      score: userScore,
    });

    const leaderboard = await getLeaderboard(postId, username, this._redis);

    await saveWordHistory(
      userWordHistoryKey(postId, userId),
      word,
      wordScore,
      "new",
      this._redis
    );
    return { word, score: wordScore, leaderboard, reason: "new" };
  }
}
