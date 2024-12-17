import { RedisClient } from "@devvit/public-api";
import { Tile } from "@lexicon/common";
import { serializeTiles } from "./serialize-tiles.ts";

export async function saveTileSelection(
  userTilesKey: string,
  tiles: Tile[],
  redis: RedisClient
) {
  const serializedTiles = serializeTiles(tiles);

  const previouslySelectedTilesSerializedJson =
    (await redis.get(userTilesKey)) || "[]";

  const previouslySelectedTilesSerialized = JSON.parse(
    previouslySelectedTilesSerializedJson
  ) as string[];

  previouslySelectedTilesSerialized.push(serializedTiles);

  await redis.set(
    userTilesKey,
    JSON.stringify(previouslySelectedTilesSerialized)
  );
}
