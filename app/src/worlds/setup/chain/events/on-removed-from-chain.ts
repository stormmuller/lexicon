import { ecs, rendering } from "@gameup/engine";
import { WordComponent } from "../../../../word";
import { ChainComponent, OnRemovedFromChainCallback } from "../../../../chain";
import { linksToWord } from "./links-to-word";

export function onRemovedFromChain(options: {
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordTextEntity: ecs.Entity;
}): OnRemovedFromChainCallback {
  const wordComponent =
    options.wordTextEntity.getComponentRequired<WordComponent>(
      WordComponent.symbol
    );
    
  return (removedlink: ecs.Entity, chainComponent: ChainComponent) => {
    const sprite = removedlink.getComponentRequired<rendering.SpriteComponent>(
      rendering.SpriteComponent.symbol
    );

    sprite.renderSource = options.renderSource;
    sprite.renderLayerName = options.renderLayer.name;

    const word = linksToWord(chainComponent.links);

    wordComponent.word = word;
  };
}
