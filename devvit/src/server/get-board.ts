import { RedisClient } from "@devvit/public-api";
import { generateRandomLetter } from "./generate-random-letter.ts";

interface BoardDimentations {
  x: number;
  y: number;
}

export async function getBoard(
  redis: RedisClient,
  postId: string
): Promise<string[] | null> {
  const rawBoard = await redis.hGet("boards", postId);

  if (!rawBoard) {
    return null;
  }

  const board = rawBoard.split("") ?? [];

  return board;
}

export async function getOrCreateBoard(
  redis: RedisClient,
  postId: string,
  boardDimentsions: BoardDimentations
) {
  let board = await getBoard(redis, postId) ?? [];

  if (board.length === 0) {
    const numberOfLetters = boardDimentsions.x * boardDimentsions.y;

    for (let i = 0; i < numberOfLetters; i++) {
      board.push(generateRandomLetter().letter);
    }

    await redis.hSet("boards", { [postId]: board.join("") });
  }

  return board;
}
