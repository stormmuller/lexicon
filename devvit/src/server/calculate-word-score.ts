import { letters } from './letters.ts';

export function calculateWordScore(word: string) {
  let total = 0;

  for (const letter of word) {
    const { score } = letters.find(l => l.letter === letter)!;
    total += score;
  }

  return total;
}