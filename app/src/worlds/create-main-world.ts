import { common, ecs, game, rendering } from "@gameup/engine";
import { createUI } from "../ui";
import { styles } from "../styles";
import {
  createBoard,
  createCameras,
  createChain,
  createInputs,
  createRenderLayers,
} from "./setup";

export async function createMainWorld(
  worldSpace: common.Space,
  layerService: rendering.LayerService,
  gameContainer: HTMLElement,
  game: game.Game
) {
  const world = new ecs.World(game);
  const inputsEntity = createInputs(world, gameContainer);

  const { worldCamera } = createCameras(world, worldSpace, inputsEntity, game);
  const { foregroundRenderLayer, focusedRenderLayer } = createRenderLayers(
    layerService,
    worldCamera,
    worldSpace,
    world
  );

  const tileImageRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.tile.size,
    styles.tile.size,
    styles.tile.borderRaduis,
    styles.tile.backgroundColor
  );

  const tileChainImageRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.tile.size,
    styles.tile.size,
    styles.tile.borderRaduis,
    styles.tile.chained.backgroundColor
  );

  createChain(
    world,
    inputsEntity,
    worldCamera,
    worldSpace,
    tileChainImageRenderSource,
    tileImageRenderSource,
    focusedRenderLayer,
    foregroundRenderLayer
  );

  await createBoard(
    foregroundRenderLayer,
    focusedRenderLayer,
    world,
    inputsEntity,
    worldCamera,
    worldSpace
  );

  createUI(world, foregroundRenderLayer);

  return world;
}
