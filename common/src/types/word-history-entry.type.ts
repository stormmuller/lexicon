import { WordHistoryReason } from "./word-history-reason.type";

export type WordHistoryEntry = {
  word: string;
  score: number;
  reason: WordHistoryReason;
};