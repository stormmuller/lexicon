import { common, ecs, game, input, rendering } from "@gameup/engine";
import {
  createCameras,
  createChain,
  createInputs,
  createLayers,
} from "./facorties";
import { HoverSystem } from "./board";
import { createBoard } from "./facorties/create-board";
import { createUI } from "./ui";
import { ChainSystem } from "./chain";

export async function createMainWorld(
  worldSpace: common.Space,
  imageCache: rendering.ImageCache,
  layerService: rendering.LayerService,
  gameContainer: HTMLElement,
  game: game.Game
) {
  const world = new ecs.World(game);

  const { worldCamera } = createCameras(world, worldSpace);
  const {
    backgroundRenderLayer,
    foregroundRenderLayer,
    focusedRenderLayer,
    debugRenderLayer,
  } = createLayers(layerService);
  const inputs = createInputs(world);
  //   createAudio(world, "song-2.mp3");

  const inputSystem = new input.InputSystem(gameContainer);

  const mousePointerSystem = new input.MousePointerSystem();
  const cameraSystem = new rendering.CameraSystem(inputs, game.time);

  const backgroundRenderSystem = new rendering.RenderSystem(
    backgroundRenderLayer,
    worldCamera,
    worldSpace
  );

  const foregroundRenderSystem = new rendering.RenderSystem(
    foregroundRenderLayer,
    worldCamera,
    worldSpace
  );

  const focusedRenderSystem = new rendering.RenderSystem(
    focusedRenderLayer,
    worldCamera,
    worldSpace
  );

  const debugRenderSystem = new rendering.DebugRenderSystem(
    debugRenderLayer,
    worldCamera,
    worldSpace
  );

  const tileImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(imageCache, "./Tile.png");
  const tileChainImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "./Tile-chain.png"
    );

  const chain = createChain(
    world,
    tileChainImageRenderSource,
    tileImageRenderSource,
    focusedRenderLayer,
    foregroundRenderLayer
  );

  const hoverSystem = new HoverSystem(inputs, worldCamera, worldSpace);
  const chainSystem = new ChainSystem(inputs, worldCamera, worldSpace, chain);

  // const audioSystem = new audio.AudioSystem();

  await createBoard(
    imageCache,
    foregroundRenderLayer,
    focusedRenderLayer,
    world
  );

  createUI(world, foregroundRenderLayer);

  world.addSystems([
    inputSystem,
    mousePointerSystem,
    cameraSystem,
    backgroundRenderSystem,
    foregroundRenderSystem,
    focusedRenderSystem,
    debugRenderSystem,
    hoverSystem,
    chainSystem,
    // audioSystem,
  ]);

  return world;
}
