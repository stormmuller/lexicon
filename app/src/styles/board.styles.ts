import { config } from "../game.config";
import { tile } from "./tile.styles";

export const board = {
  marginTop: 160,
  width: (tile.size + tile.gap) * config.gridSize.x - tile.gap,
  height: (tile.size + tile.gap) * config.gridSize.y - tile.gap,
};
