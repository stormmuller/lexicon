import { RedisClient } from "@devvit/public-api";
import words from "./words.json";

export const wordsSetName = "words";

export async function cacheWords(redis: RedisClient) {
  const numberOfCachedWords = await redis.zCard(wordsSetName);

  // const response = await fetch(
  //   "https://api.dictionaryapi.dev/api/v2/entries/en/hello"
  // );
  // const result = await response.json();
  // console.log("result: ", result);

  console.log(`Skipping word loading as ${words.length} words are cached.`);

  if (numberOfCachedWords === 0) {
    console.log("Started Caching...");
    const start = performance.now();
    await redis.zAdd(wordsSetName, ...words);
    const end = performance.now();
    console.log(
      `Caching complete, cached ${words.length} words in ${end - start}ms.`
    );
  }
}
