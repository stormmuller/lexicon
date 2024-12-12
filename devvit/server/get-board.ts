import { RedisClient } from "@devvit/public-api";
import { generateRandomLetter } from "./generate-random-letter.ts";

interface BoardDimentations {
    x: number,
    y: number
}

export async function getBoard(
  redis: RedisClient,
  postId: string,
  boardDimentsions: BoardDimentations
): Promise<string[]> {
  const rawBoard = await redis.hGet("boards", postId);
  let board = rawBoard?.split("") ?? [];

  if (board.length === 0) {
    const numberOfLetters = boardDimentsions.x * boardDimentsions.y;

    for (let i = 0; i < numberOfLetters; i++) {
        board.push(generateRandomLetter().letter)
    }
    
    await redis.hSet("boards", { [postId]: board.join('') })
  }

  return board;
}
