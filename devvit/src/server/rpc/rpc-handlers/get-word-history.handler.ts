import { RedisClient } from "@devvit/public-api";
import {
  GetWordHistoryRpcRequest,
  GetWordHistoryRpcResponse,
  rpc_getWordHistory,
} from "@lexicon/common";
import { Rpc, RpcHandler } from "../rpc-handler.ts";
import { getWordHistory } from "../../get-word-history.ts";

export type GetWordHistoryMessage = Rpc<GetWordHistoryRpcRequest>;

export class GetWordHistoryMessageHandler extends RpcHandler<
  GetWordHistoryMessage,
  GetWordHistoryRpcResponse
> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(rpc_getWordHistory);

    this._redis = redis;
  }

  public override async handle(message: GetWordHistoryMessage) {
    let { postId, userId } = message;

    const history = await getWordHistory(postId, userId, this._redis);

    return { history };
  }
}
