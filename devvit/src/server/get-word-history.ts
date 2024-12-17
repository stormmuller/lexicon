import { RedisClient } from "@devvit/public-api";
import { userWordHistoryKey } from "./redis-keys.ts";
import { WordHistoryEntry, WordHistoryReason } from "@lexicon/common";

export async function getWordHistory(
  postId: string,
  userId: string,
  redis: RedisClient
): Promise<WordHistoryEntry[]> {
  const rawEntries =
    (await redis.get(userWordHistoryKey(postId, userId))) || "";

  const serializedEntries = rawEntries.split(",");

  let history: WordHistoryEntry[] = [];

  for (const serializedEntry of serializedEntries) {
    if (!serializedEntry) {
      continue;
    }

    const items = serializedEntry.split("-");

    history.push({
      word: items[0],
      score: Number(items[1]),
      reason: items[2] as WordHistoryReason,
    });
  }

  return history;
}
