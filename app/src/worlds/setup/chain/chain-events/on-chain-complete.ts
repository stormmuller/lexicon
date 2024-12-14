import { rendering } from "@gameup/engine";
import { makeRpc } from "../../../../rpc/make-rpc";
import { linksToWord } from "./links-to-word";
import { WordComponent } from "../../../../word";
import { ChainComponent } from "../../../../chain";

export function onChainComplete(options: {
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordComponent: WordComponent;
}) {
  return async (chainComponent: ChainComponent) => {
    const word = linksToWord(chainComponent.links);

    for (const linkEntity of chainComponent.links) {
      const sprite = linkEntity.getComponentRequired<rendering.SpriteComponent>(
        rendering.SpriteComponent.symbol
      );

      sprite.renderSource = options.renderSource;
      sprite.renderLayerName = options.renderLayer.name;
    }

    chainComponent.clearChain();
    options.wordComponent.word = "";

    makeRpc<number>("chain-complete", { word }, (score) => {
      console.log(`You gotz the score! ${score} ⭐`);
    });
  };
}
