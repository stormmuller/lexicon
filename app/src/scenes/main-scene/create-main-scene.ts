import { common, game, rendering } from "@gameup/engine";
import { createMainWorld } from "../../worlds";
import { WindowResizer } from "../../window-resizer";

export async function createMainScene(wordTreeGame: game.Game) {
  const mainScene = new game.Scene("main");

  const worldSpace = new common.Space(window.innerWidth, window.innerHeight);
  const gameContainer = document.getElementById("game") as HTMLDivElement;
  const layerService = new rendering.LayerService(gameContainer);

  const mainWorld = await createMainWorld(
    worldSpace,
    layerService,
    gameContainer,
    wordTreeGame
  );

  const windowResizer = new WindowResizer(
    mainWorld,
    wordTreeGame,
    [...layerService.layers],
  );

  mainScene.registerUpdateable(mainWorld);
  mainScene.registerStoppable(mainWorld);
  mainScene.registerStoppable(windowResizer);

  return mainScene;
}
