import { createMainScene } from "./create-main-scene";
import { DevvitMessageDispatcher } from "./devvit-message-dispatcher";
import {
  messageTypes,
  windowResizeMessageHandler,
} from "./devvit-message-handlers";
import "./font.css";
import "./style.css";
import { game } from "@gameup/engine";

const wordTreeGame = new game.Game();
const messageDispatcher = new DevvitMessageDispatcher();

messageDispatcher.register(
  messageTypes.windowResize,
  windowResizeMessageHandler
);

window.addEventListener("message", (event) => {
  if (event.data.type === "devvit-message") {
    const { type, data } = event.data.data.message;

    messageDispatcher.dispatch(type, data);
  }
});

const mainScene = await createMainScene(wordTreeGame);

wordTreeGame.registerScene(mainScene);

wordTreeGame.run();
