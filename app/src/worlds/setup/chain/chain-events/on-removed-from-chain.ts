import { ecs, rendering } from "@gameup/engine";
import { WordComponent } from "../../../../word";
import { ChainComponent } from "../../../../chain";
import { linksToWord } from "./links-to-word";

export function onRemovedFromChain(options: {
  renderSource: rendering.RenderSource,
  renderLayer: rendering.RenderLayer,
  wordComponent: WordComponent
}) {
  return (removedlink: ecs.Entity, chainComponent: ChainComponent) => {
    const sprite = removedlink.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = options.renderSource;
    sprite.renderLayerName = options.renderLayer.name;

    const word = linksToWord(chainComponent.links);

    options.wordComponent.word = word;
  };
}
