import { config } from "../game.config";
import { startGame } from "../start-game";

export type InitialDataMessage = {
  username: string,
  score: number,
  board: string[]
};

export function initialDataMessageHandler(message: InitialDataMessage) {
  config.board = message.board;
  config.score = message.score;
  
  void startGame();
}
