import { letters } from "./letters.ts";

export function generateRandomLetter() {
  const cumulativeWeights = new Array<{
    letter: string;
    score: number;
    cumulative: number;
  }>();

  let totalWeight = 0;

  for (const { letter, weight, score } of letters) {
    totalWeight += weight;
    cumulativeWeights.push({ letter, score, cumulative: totalWeight });
  }

  // Generate a random number within the total weight range
  const randomValue = Math.random() * totalWeight;

  // Find the letter corresponding to the random value
  for (const { letter, score, cumulative } of cumulativeWeights) {
    if (randomValue <= cumulative) {
      return { letter: letter, score };
    }
  }

  // Fallback (should not happen if weights are set up correctly)
  throw new Error("Failed to select a letter. Check your weights.");
}
