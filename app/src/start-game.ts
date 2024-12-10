import { game } from "@gameup/engine";
import { createMainScene } from "./scenes";

export async function startGame() {
  const wordTreeGame = new game.Game();
  const mainScene = await createMainScene(wordTreeGame);

  wordTreeGame.registerScene(mainScene);

  wordTreeGame.run();
}
