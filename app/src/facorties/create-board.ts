import { ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { generateRandomLetter } from "../generate-random-letter";
import { createTile } from "./create-tile";

export async function createBoard(
  imageCache: rendering.ImageCache,
  normalLayer: rendering.RenderLayer,
  focusedRenderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  for (let x = 0; x < config.gridSize.x; x++) {
    for (let y = 0; y < config.gridSize.y; y++) {
      await createTile(
        generateRandomLetter(),
        x,
        y,
        imageCache,
        normalLayer,
        focusedRenderLayer,
        world
      );
    }
  }
}
