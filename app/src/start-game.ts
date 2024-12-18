import { game } from "@gameup/engine";
import { createMainScene } from "./scenes";

let gameStarted = false;

export function startGame() {
  window.setTimeout(async () => {
    if (gameStarted) {
      console.warn("[Lexicon] game already started, skipping initialization!");
      return; // Do not start the game twice
    }

    console.log("[Lexicon] initializing...");

    gameStarted = true;
    
    const wordTreeGame = new game.Game();
    const mainScene = await createMainScene(wordTreeGame);
    
    wordTreeGame.registerScene(mainScene);
    
    wordTreeGame.run();
  }, 100); // TODO: hack for now because I don't have time to deal with the window resizing...
}
