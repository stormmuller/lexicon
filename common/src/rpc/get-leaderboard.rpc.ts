import { LeaderboardEntry } from "../types";

export type GetLeaderboardRpcRequest = null;

export type GetLeaderboardRpcResponse = {
  leaderboard: Array<LeaderboardEntry>;
};

export const rpc_getLeaderboard = 'get-leaderboard';