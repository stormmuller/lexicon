import { LeaderboardEntry, Tile } from "../types";

export type ChainCompleteRpcRequest = {
  tiles: Array<Tile>;
};

export type ChainCompleteRpcResponse = {
  word: string;
  score: number;
  reason: 'new' | 'repeat' | 'notfound';
  leaderboard: Array<LeaderboardEntry>;
};

export const rpc_chainComplete = 'chain-complete';