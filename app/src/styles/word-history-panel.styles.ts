import { board } from "./board.styles";
import { tile } from "./tile.styles";

export const wordHistoryPanel = {
  height: 100,
  margin: 20,
  width: board.width + tile.size * 2,
  spaceBetween: 15,
  padding: {
    x: 15,
    y: 15
  }
};
