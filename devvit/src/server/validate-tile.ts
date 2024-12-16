import { Tile } from "@lexicon/common";
import { configuration } from "../configuration.ts";

export function validateTile(tile: Tile) {
  const isInXBounds = tile.x < configuration.boardDimentions.x;
  const isInYBounds = tile.y < configuration.boardDimentions.y;

  return isInXBounds && isInYBounds;
}
