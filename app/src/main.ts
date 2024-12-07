import { createMainScene } from "./create-main-scene";
import "./font.css";
import "./style.css";
import { game } from "@gameup/engine";

const wordTreeGame = new game.Game();
const mainScene = await createMainScene(wordTreeGame);

wordTreeGame.registerScene(mainScene);

wordTreeGame.run();
