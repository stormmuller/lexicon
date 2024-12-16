import { game } from "@gameup/engine";
import { createMainScene } from "./scenes";

export function startGame() {
  window.setTimeout(async () => {
    const wordTreeGame = new game.Game();
    const mainScene = await createMainScene(wordTreeGame);

    wordTreeGame.registerScene(mainScene);

    wordTreeGame.run();
  }, 100); // TODO: hack for now because I don't have time to deal with the window resizing...
}
