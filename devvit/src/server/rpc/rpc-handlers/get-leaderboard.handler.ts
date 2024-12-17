import { RedisClient } from "@devvit/public-api";
import {
  GetLeaderboardRpcRequest,
  GetLeaderboardRpcResponse,
  rpc_getLeaderboard,
} from "@lexicon/common";
import { Rpc, RpcHandler } from "../rpc-handler.ts";
import { getLeaderboard } from "../../get-leaderboard.ts";

export type GetLeaderboardMessage = Rpc<GetLeaderboardRpcRequest>;

export class GetLeaderboardMessageHandler extends RpcHandler<
  GetLeaderboardMessage,
  GetLeaderboardRpcResponse
> {
  private _redis: RedisClient;

  constructor(redis: RedisClient) {
    super(rpc_getLeaderboard);

    this._redis = redis;
  }

  public override async handle(message: GetLeaderboardMessage) {
    let { postId, username } = message;

    const leaderboard = await getLeaderboard(postId, username, this._redis);

    return { leaderboard };
  }
}
