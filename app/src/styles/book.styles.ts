import { sidePanel } from "./side-panel.styles";
import { wordHistoryPanel } from "./word-history-panel.styles";

export const book = {
  position: {
    x: wordHistoryPanel.position.x,
    y: wordHistoryPanel.position.y - sidePanel.height / 2 - 15,
  },
};
