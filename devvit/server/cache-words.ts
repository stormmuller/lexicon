import { RedisClient } from "@devvit/public-api";
const wordDefinitions = [];
const words = [];
// import wordDefinitions from "./word-definitions.json";
// import words from "./words.json";

export const wordDefinitionsKeyName = "word-definitions";
export const wordsKeyName = "words";

export async function cacheWords(redis: RedisClient) {
  const numberOfCachedWordDefinitions = await redis.hLen(
    wordDefinitionsKeyName
  );

  if (numberOfCachedWordDefinitions === 0) {
    console.log("Started Caching word definitions...");
    const start = performance.now();
    await redis.hSet(wordDefinitionsKeyName, ...wordDefinitions);
    const end = performance.now();
    console.log(
      `Word definitions caching complete, cached ${
        wordDefinitions.length
      } words in ${end - start}ms. 🚀`
    );
  } else {
    console.log("Word definitions cache already warm 🔥");
  }

  const numberOfCachedWords = await redis.zCard(wordsKeyName);

  if (numberOfCachedWords === 0) {
    console.log("Started Caching words...");
    const start = performance.now();
    await redis.zAdd(wordsKeyName, ...words);
    const end = performance.now();
    console.log(
      `Words caching complete, cached ${wordsKeyName.length} words in ${
        end - start
      }ms. 🚀`
    );
  } else {
    console.log("Words cache already warm 🔥");
  }
}
