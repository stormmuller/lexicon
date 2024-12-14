import { ecs, rendering } from "@gameup/engine";
import { WordComponent } from "../../../../word";
import { linksToWord } from "./links-to-word";
import { ChainComponent } from "../../../../chain";

export function onAddedToChain(options: {
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordComponent: WordComponent;
}) {
  return (addedLink: ecs.Entity, chainComponent: ChainComponent) => {
    const sprite = addedLink.getComponentRequired<rendering.SpriteComponent>(
      rendering.SpriteComponent.symbol
    );

    sprite.renderSource = options.renderSource;
    sprite.renderLayerName = options.renderLayer.name;

    const word = linksToWord(chainComponent.links);

    options.wordComponent.word = word;
  };
}
