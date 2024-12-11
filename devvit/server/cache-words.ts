import { RedisClient, ZMember } from "@devvit/public-api";
import words from './words.json';

export const wordsSetName = "words";

export async function cacheWords(redis: RedisClient) {
  const numberOfCachedWords = await redis.zCard(wordsSetName);

  console.log(`Skipping word loading as ${words.length} words are cached.`);

  if(numberOfCachedWords === 0) {
    console.log('Started Caching...');
    const start = performance.now();
    await redis.zAdd(wordsSetName, ...words);
    const end = performance.now();
    console.log(`Caching complete, cached ${words.length} words in ${end - start}ms.`);
  }
}
