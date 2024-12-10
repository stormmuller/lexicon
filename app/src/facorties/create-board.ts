import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { createTile } from "./create-tile";
import { gameState } from "../game-state";
import { HoverSystem } from "../hoverable";

async function createTiles(
  normalLayer: rendering.RenderLayer,
  focusedRenderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  for (let x = 0; x < config.gridSize.x; x++) {
    for (let y = 0; y < config.gridSize.y; y++) {
      await createTile(
        gameState.boardLetters[x + y * x],
        x,
        y,
        normalLayer,
        focusedRenderLayer,
        world
      );
    }
  }
}

export async function createBoard(
  normalLayer: rendering.RenderLayer,
  focusedRenderLayer: rendering.RenderLayer,
  world: ecs.World,
  inputsEntity: ecs.Entity,
  cameraEntity: ecs.Entity,
  worldSpace: common.Space
) {
  createTiles(normalLayer, focusedRenderLayer, world);

  const hoverSystem = new HoverSystem(inputsEntity, cameraEntity, worldSpace);

  world.addSystem(hoverSystem);
}
