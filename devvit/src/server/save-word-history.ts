import { RedisClient } from "@devvit/public-api";
import { WordHistoryReason } from "@lexicon/common";

export async function saveWordHistory(
  userWordHistoryKey: string,
  word: string,
  score: number,
  reason: WordHistoryReason,
  redis: RedisClient
) {
  const entry = `${word}-${score}-${reason},`;

  const currentWordHistory = (await redis.get(userWordHistoryKey)) || "";
  const newWordHistory = currentWordHistory.concat(entry);

  await redis.set(
    userWordHistoryKey,
    newWordHistory
  );
}
