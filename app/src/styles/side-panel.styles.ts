import { board } from "./board.styles";
import { tile } from "./tile.styles";

export const sidePanel = {
  width: 160,
  height: board.height - tile.size,
  margin: 20,
  padding: {
    x: 15,
    y: 15
  }
}