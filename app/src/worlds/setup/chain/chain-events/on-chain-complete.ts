import { common, ecs, math, rendering } from "@gameup/engine";
import { ChainCompleteRpcRequest, ChainCompleteRpcResponse } from "@gameup/rpc-types";
import { makeRpc } from "../../../../rpc/make-rpc";
import { WordComponent } from "../../../../word";
import { ChainComponent } from "../../../../chain";
// import { linksToWord } from "./links-to-word";
import { styles } from "../../../../styles";
import { TileComponent } from "../../../../tile";

export function onChainComplete(options: {
  world: ecs.World;
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordComponent: WordComponent;
  words: Array<ecs.Entity>;
}) {
  return async (chainComponent: ChainComponent) => {
    const tiles = Array<math.Vector2>();

    for (const link of chainComponent.links) {
      const tileComponent = link.getComponentRequired<TileComponent>(
        TileComponent.symbol
      );

      tiles.push(new math.Vector2(tileComponent.x, tileComponent.y));
    }

    for (const linkEntity of chainComponent.links) {
      const sprite = linkEntity.getComponentRequired<rendering.SpriteComponent>(
        rendering.SpriteComponent.symbol
      );

      sprite.renderSource = options.renderSource;
      sprite.renderLayerName = options.renderLayer.name;
    }

    chainComponent.clearChain();
    options.wordComponent.word = "";

    makeRpc<ChainCompleteRpcRequest, ChainCompleteRpcResponse>(
      "chain-complete",
      { tiles },
      ({ word, score }) => {
        const date = new Date();

        const wordTextRenderSource = new rendering.TextRenderSource(
          word,
          styles.sidePanel.width - styles.wordHistoryPanel.padding.x * 2,
          styles.sidePanel.width - styles.wordHistoryPanel.padding.x - 70,
          "Share Tech Mono",
          20,
          styles.colors.primary,
          "start"
        );

        const scoreTextRenderSource = new rendering.TextRenderSource(
          `+${score.toString()}`,
          styles.sidePanel.width - styles.wordHistoryPanel.padding.x * 2,
          styles.sidePanel.width - styles.wordHistoryPanel.padding.x,
          "Share Tech Mono",
          18,
          styles.colors.white,
          "end"
        );

        const scoreHistoryRenderSource = new rendering.CompositeRenderSource({
          word: wordTextRenderSource,
          score: scoreTextRenderSource,
        });

        const wordEntity = new ecs.Entity(`word (${word},${score},${date})`, [
          new rendering.SpriteComponent(
            scoreHistoryRenderSource,
            options.renderLayer.name
          ),
          new common.PositionComponent(),
        ]);

        options.words.push(wordEntity);
        options.world.addEntity(wordEntity);
      }
    );
  };
}
