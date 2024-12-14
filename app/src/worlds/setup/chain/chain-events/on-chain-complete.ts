import { common, ecs, rendering } from "@gameup/engine";
import { makeRpc } from "../../../../rpc/make-rpc";
import { DateComponent, ScoreComponent, WordComponent } from "../../../../word";
import { ChainComponent } from "../../../../chain";
import { linksToWord } from "./links-to-word";

export function onChainComplete(options: {
  world: ecs.World;
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
      const date = new Date();

      const wordTextRenderSource = new rendering.TextRenderSource(word);
      const scoreTextRenderSource = new rendering.TextRenderSource(`+${score}`);
      const scoreHistoryRenderSource = new rendering.CompositeRenderSource({
        word: wordTextRenderSource,
        score: scoreTextRenderSource
      });

      options.world.addEntity(
        new ecs.Entity(`word (${word},${score},${date})`, [
          new WordComponent(word),
          new ScoreComponent(score),
          new DateComponent(date),
          new rendering.SpriteComponent(scoreHistoryRenderSource, options.renderLayer.name),
          new common.PositionComponent(window.innerWidth / 2, window.innerHeight / 2)
        ])
      );

      console.log(`You gotz the score! ${score} ⭐`);
    });
  };
}
