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
    const { data, postId } = message;
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
      return { word, score: 0 };
    }

    const score = calculateWordScore(word);

    return { word, score };
  }
}
