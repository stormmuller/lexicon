import { gameState } from "../game-state";
import { startGame } from "../start-game";

export type InitialDataMessage = {
  username: string,
  score: number,
  board: string[]
};

export function initialDataMessageHandler(message: InitialDataMessage) {
  gameState.boardLetters = message.board;
  gameState.score = message.score;
  gameState.username = message.username;
  
  startGame();
}
