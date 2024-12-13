import { ecs } from "@gameup/engine";
import { makeRpc } from "../../../../rpc/make-rpc";
import { linksToWord } from "./links-to-word";

export async function onChainComplete(links: Array<ecs.Entity>) {
  const word = linksToWord(links);

  makeRpc<number>("chain-complete", { word }, (score) => {
    console.log(`You gotz the score! ${score} ⭐`);
  });

  window.parent.postMessage(
    {
      type: "chain-complete",
      data: { word },
    },
    "*"
  );
}
