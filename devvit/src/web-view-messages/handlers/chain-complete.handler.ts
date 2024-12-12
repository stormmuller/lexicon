import { RedisClient } from "@devvit/public-api";
import { Message, MessageHandler } from "../message-handler.ts";
import { wordsKeyName } from "../../../server/cache-words.ts";
import { calculateWordScore } from "../../../server/calculate-word-score.ts";

export type ChainCompleteMessage = Message<{ word: string }>;
export const chainCompleteMessageType = "chain-complete";

export class ChainCompleteMessageHandler extends MessageHandler<ChainCompleteMessage, number | null> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(chainCompleteMessageType);

    this._redis = redis;
  }

  public override async handle(message: ChainCompleteMessage) {
    const sanitizedWord = message.data.word.toLowerCase();

    const wordRank = await this._redis.zRank(
      wordsKeyName,
      sanitizedWord
    );

    const isValidWord = wordRank !== undefined;

    if (!isValidWord) {
      return null;
    }

    const score = calculateWordScore(sanitizedWord);

    return score;
  }
}
