import { common, ecs, game, rendering } from "@gameup/engine";
import {
  createCameras,
  createChain,
  createInputs,
  createLayers as createRenderLayers,
} from "../facorties";
import { createBoard } from "../facorties/create-board";
import { createUI } from "../ui";

export async function createMainWorld(
  worldSpace: common.Space,
  imageCache: rendering.ImageCache,
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

  const tileImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(imageCache, "./Tile.png");
  const tileChainImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "./Tile-chain.png"
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
    imageCache,
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
