import { WordHistoryEntry } from "../types";

export type GetWordHistoryRpcRequest = null;

export type GetWordHistoryRpcResponse = {
  history: Array<WordHistoryEntry>;
};

export const rpc_getWordHistory = 'get-word-history';