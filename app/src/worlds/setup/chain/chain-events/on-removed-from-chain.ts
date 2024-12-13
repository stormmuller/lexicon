import { ecs, rendering } from "@gameup/engine";
import { WordComponent } from "../../../../word";
import { linksToWord } from "./links-to-word";

export function onRemovedFromChain(options: {
  renderSource: rendering.RenderSource,
  renderLayer: rendering.RenderLayer,
  wordComponent: WordComponent
}) {
  return (entity: ecs.Entity, links: Array<ecs.Entity>) => {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = options.renderSource;
    sprite.renderLayerName = options.renderLayer.name;

    const word = linksToWord(links);

    options.wordComponent.word = word;
  };
}
