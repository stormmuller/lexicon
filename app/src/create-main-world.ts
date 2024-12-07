import { common, ecs, game, input, rendering } from "@gameup/engine";
import { createCameras, createInputs, createLayers } from "./setup";
import { createBlankTile } from "./setup/create-blank-tile";
import { createLetter } from "./create-letter";
import { HoverSystem } from "./board";

export async function createMainWorld(
  worldSpace: common.Space,
  imageCache: rendering.ImageCache,
  layerService: rendering.LayerService,
  gameContainer: HTMLElement,
  game: game.Game
) {
  const world = new ecs.World(game);

  const { worldCamera } = createCameras(world, worldSpace);
  const { backgroundRenderLayer, foregroundRenderLayer, debugRenderLayer } =
    createLayers(layerService);
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

  const debugRenderSystem = new rendering.DebugRenderSystem(
    debugRenderLayer,
    worldCamera,
    worldSpace
  );

  const hoverSystem = new HoverSystem(worldCamera, worldSpace);

  // const audioSystem = new audio.AudioSystem();

  const gridSize = 20;
  const tileSize = 128;
  const padding = 16;

  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      const calculatedX = x * (tileSize + padding);
      const calculatedY = y * (tileSize + padding);
      
      await createBlankTile(imageCache, foregroundRenderLayer, world, calculatedX, calculatedY, `tile [${x};${y}]`);
      await createLetter(foregroundRenderLayer, world, calculatedX, calculatedY, "W", 80);
    }
  }

  world.addSystems([
    inputSystem,
    mousePointerSystem,
    cameraSystem,
    backgroundRenderSystem,
    foregroundRenderSystem,
    debugRenderSystem,
    hoverSystem,
    // audioSystem,
  ]);

  return world;
}
