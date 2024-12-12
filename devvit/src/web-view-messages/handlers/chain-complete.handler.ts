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
    console.log(message);
    const sanitizedWord = message.data.word.toLowerCase();

    const wordRank = await this._redis.zRank(
      wordsKeyName,
      sanitizedWord
    );

    const isValidWord = wordRank !== undefined;

    // check if word in words db
    if (isValidWord) {
      const score = calculateWordScore(sanitizedWord);

      console.log(`score: ${score}`)

      return score;
      //  true:
      //    check if in defintions db:
      //      true:
      //        return success result + definitions
      //      false:
      //        look up word via definition api
      //        save in defintion db
      //        return success result + definitions
    } else {
      //  false:
      //    return failure
    }

    return null;
  }
}
