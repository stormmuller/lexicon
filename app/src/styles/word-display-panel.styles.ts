import { board } from "./board.styles";
import { tile } from "./tile.styles";

const height = 80;
const margin = 20;

export const wordDisplayPanel = {
  height,
  margin,
  width: board.width + tile.size * 2,
  position: {
    x: window.innerWidth / 2,
    y: margin + height / 2,
  },
  fontSize: 60
};
