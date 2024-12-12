import { RedisClient } from "@devvit/public-api";
import { MessageHandler } from "../message-handler.ts";
import { wordsKeyName } from "../../../server/cache-words.ts";

export type ChainCompleteMessage = { word: string };
export const chainCompleteMessageType = "chain-complete";

export class ChainCompleteMessageHandler extends MessageHandler<ChainCompleteMessage> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(chainCompleteMessageType);

    this._redis = redis;
  }

  public override async handle(message: ChainCompleteMessage): Promise<void> {
    const wordRank = await this._redis.zRank(
      wordsKeyName,
      message.word.toLowerCase()
    );
    const isValidWord = wordRank !== undefined;

    // check if word in words db
    if (isValidWord) {
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
    console.log(message);
  }
}
