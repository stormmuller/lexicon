import { common, ecs, game, rendering } from "@gameup/engine";
import { styles } from "../styles";
import {
  createBoard,
  createCameras,
  createChain,
  createInputs,
  createRenderLayers,
} from "./setup";
import { createWordDisplay as createWordDisplay } from "./setup/word-display";
import { createWordHistory } from "./setup/word-history";
import { createLeaderboard } from "./setup/leader-board";

export async function createMainWorld(
  worldSpace: common.Space,
  layerService: rendering.LayerService,
  gameContainer: HTMLElement,
  game: game.Game
) {
  const world = new ecs.World(game);
  const inputsEntity = createInputs(world, gameContainer);

  const { worldCamera } = createCameras(world, worldSpace, inputsEntity, game);
  const { foregroundRenderLayer, backgroundRenderLayer, focusedRenderLayer } =
    createRenderLayers(layerService, worldCamera, worldSpace, world);

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
    styles.tile.backgroundColor,
    { width: 2, color: "yellow" }
  );

  const { wordTextEntity } = createWordDisplay(
    world,
    foregroundRenderLayer,
    backgroundRenderLayer
  );

  const { words } = createWordHistory(world, backgroundRenderLayer);
  createLeaderboard(world, backgroundRenderLayer);

  createChain(
    world,
    inputsEntity,
    worldCamera,
    worldSpace,
    tileChainImageRenderSource,
    tileImageRenderSource,
    focusedRenderLayer,
    foregroundRenderLayer,
    wordTextEntity,
    words
  );

  await createBoard(
    foregroundRenderLayer,
    focusedRenderLayer,
    world,
    inputsEntity,
    worldCamera,
    worldSpace
  );

  return world;
}
