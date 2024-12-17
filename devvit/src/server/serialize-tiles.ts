import { Tile } from "@lexicon/common";

export function serializeTiles(tiles: Tile[]) {
  return tiles.map(serializeTile).join("|");
}

export function serializeTile(tile: Tile) {
  return `${tile.x},${tile.y}`;
}
