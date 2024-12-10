import { DevvitMessageDispatcher } from "./devvit-message-dispatcher";
import {
  initialDataMessageHandler,
  messageTypes,
  windowResizeMessageHandler,
} from "./devvit-message-handlers";
import "./font.css";
import "./style.css";

const messageDispatcher = new DevvitMessageDispatcher();

messageDispatcher
  .register(messageTypes.windowResize, windowResizeMessageHandler)
  .register(messageTypes.initialData, initialDataMessageHandler);

window.addEventListener("message", (event) => {
  if (event.data.type === "devvit-message") {
    const { type, data } = event.data.data.message;

    messageDispatcher.dispatch(type, data);
  }
});

const testData = {
  board: [
    "C",
    "A",
    "T",
    "L",
    "P",
    "U",
    "L",
    "N",
    "P",
    "M",
    "M",
    "X",
    "T",
    "Z",
    "B",
    "J",
    "Z",
    "B",
    "R",
    "F",
    "Z",
    "V",
    "P",
    "F",
    "S",
    "B",
    "I",
    "C",
    "D",
    "D",
    "M",
    "S",
    "U",
    "N",
    "L",
    "P",
    "J",
    "C",
    "Q",
    "Q",
    "C",
    "E",
    "C",
    "B",
    "Y",
    "S",
    "R",
    "B",
    "G",
    "J",
    "X",
    "N",
    "N",
    "A",
    "N",
    "J",
  ],
  score: 12847,
  username: 'Storm'
};

initialDataMessageHandler(testData);
