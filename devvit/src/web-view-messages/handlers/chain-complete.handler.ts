import { RedisClient } from "@devvit/public-api";
import {
  ChainCompleteRpcRequest,
  ChainCompleteRpcResponse,
} from "@gameup/rpc-types";
import { Message, MessageHandler } from "../message-handler.ts";
import { wordsKeyName } from "../../../server/cache-words.ts";
import { calculateWordScore } from "../../../server/calculate-word-score.ts";
import { getBoard } from "../../../server/get-board.ts";
import { configuration } from "../../configuration.ts";

export type ChainCompleteMessage = Message<ChainCompleteRpcRequest>;
export const chainCompleteMessageType = "chain-complete";

export class ChainCompleteMessageHandler extends MessageHandler<
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
