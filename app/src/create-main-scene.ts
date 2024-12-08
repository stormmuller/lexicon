import { common, game, rendering } from "@gameup/engine";
import { createMainWorld } from "./create-main-world";
import { WindowResizer } from "./facorties/window-resizer";

export async function createMainScene(wordTreeGame: game.Game) {
  const mainScene = new game.Scene("main");

  const worldSpace = new common.Space(window.innerWidth, window.innerHeight);
  const imageCache = new rendering.ImageCache();
  const gameContainer = document.getElementById("game") as HTMLDivElement;
  const layerService = new rendering.LayerService(gameContainer);

  const mainWorld = await createMainWorld(
    worldSpace,
    imageCache,
    layerService,
    gameContainer,
    wordTreeGame
  );

  const windowResizer = new WindowResizer(
    mainWorld,
    wordTreeGame,
    // worldSpace,
    [...layerService.layers],
  );


  mainScene.registerUpdateable(mainWorld);
  mainScene.registerStoppable(mainWorld);
  mainScene.registerStoppable(windowResizer);

  return mainScene;
}
