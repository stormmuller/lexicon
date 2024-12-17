import { LeaderboardEntry, Tile, WordHistoryReason } from "../types";

export type ChainCompleteRpcRequest = {
  tiles: Array<Tile>;
};

export type ChainCompleteRpcResponse = {
  word: string;
  score: number;
  reason: WordHistoryReason;
  leaderboard: Array<LeaderboardEntry>;
};

export const rpc_chainComplete = 'chain-complete';