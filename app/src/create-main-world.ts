import { common, ecs, game, input, rendering } from "@gameup/engine";
import { createCameras, createInputs, createLayers } from "./facorties";
import { HoverSystem } from "./board";
import { createBoard } from "./facorties/create-board";

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

  const hoverSystem = new HoverSystem(worldCamera, worldSpace);

  // const audioSystem = new audio.AudioSystem();

  await createBoard(
    imageCache,
    foregroundRenderLayer,
    focusedRenderLayer,
    world
  );

  world.addSystems([
    inputSystem,
    mousePointerSystem,
    cameraSystem,
    backgroundRenderSystem,
    foregroundRenderSystem,
    focusedRenderSystem,
    debugRenderSystem,
    hoverSystem,
    // audioSystem,
  ]);

  return world;
}
