import { ecs, rendering } from "@gameup/engine";
import { WordComponent } from "../../../../word";
import { linksToWord } from "./links-to-word";
import { ChainComponent, OnAddedToChainCallback } from "../../../../chain";

export function onAddedToChain(options: {
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordTextEntity: ecs.Entity;
}): OnAddedToChainCallback {
  const wordComponent =
    options.wordTextEntity.getComponentRequired<WordComponent>(
      WordComponent.symbol
    );

  return (addedLink: ecs.Entity, chainComponent: ChainComponent) => {
    const sprite = addedLink.getComponentRequired<rendering.SpriteComponent>(
      rendering.SpriteComponent.symbol
    );

    sprite.renderSource = options.renderSource;
    sprite.renderLayerName = options.renderLayer.name;

    const word = linksToWord(chainComponent.links);

    wordComponent.word = word;
  };
}
