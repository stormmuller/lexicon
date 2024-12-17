import { letters } from "./letters.ts";

export function calculateWordScore(word: string) {
  let total = 0;

  for (const letter of word) {
    const { score } = letters.find((l) => l.letter === letter)!;
    total += score;
  }

  const multiplier =
    word.length === 3 ? 1 : 
    word.length === 4 ? 1.5 : 
    word.length === 5 ? 2 : 
    word.length === 6 ? 3 : 5;

  return Math.ceil(total * multiplier);
}
