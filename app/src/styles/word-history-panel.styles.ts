import { board } from "./board.styles";
import { sidePanel } from "./side-panel.styles";
import { tile } from "./tile.styles";

export const wordHistoryPanel = {
  spaceBetween: 15,
  position: {
    x:
      window.innerWidth / 2 +
      board.width / 2 +
      sidePanel.width / 2 +
      sidePanel.margin,
    y: board.height / 2 + board.marginTop - tile.size / 2,
  },
};
