import { animations, common, ecs, math, rendering } from "@gameup/engine";
import {
  ChainCompleteRpcRequest,
  ChainCompleteRpcResponse,
  rpc_chainComplete,
} from "@lexicon/common";
import { makeRpc } from "../../../../rpc/make-rpc";
import { WordComponent } from "../../../../word";
import { ChainComponent, OnChainCompleteCallback } from "../../../../chain";
import { styles } from "../../../../styles";
import { TileComponent } from "../../../../tile";
import { LeaderboardUpdater } from "../../../../leaderboard";

export function onChainComplete(options: {
  world: ecs.World;
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordTextEntity: ecs.Entity;
  bookEntity: ecs.Entity;
  wordsCollection: Array<ecs.Entity>;
  leaderboardUpdater: LeaderboardUpdater;
}): OnChainCompleteCallback {
  const wordComponent =
    options.wordTextEntity.getComponentRequired<WordComponent>(
      WordComponent.symbol
    );

  const wordTextSpriteComponent =
    options.wordTextEntity.getComponentRequired<rendering.SpriteComponent>(
      rendering.SpriteComponent.symbol
    );

  const wordTextPositionComponent =
    options.wordTextEntity.getComponentRequired<common.PositionComponent>(
      common.PositionComponent.symbol
    );

  const wordTextRenderSource =
    wordTextSpriteComponent.renderSource as rendering.TextRenderSource;

  const wordTextAnimationComponent =
    options.wordTextEntity.getComponentRequired<animations.AnimationComponent>(
      animations.AnimationComponent.symbol
    );

  const bookScaleComponent =
    options.bookEntity.getComponentRequired<common.ScaleComponent>(
      common.ScaleComponent.symbol
    );

  const bookAnimationComponent =
    options.bookEntity.getComponentRequired<animations.AnimationComponent>(
      animations.AnimationComponent.symbol
    );

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

    const bookConsumeAnimation: animations.AnimatedProperty = {
      startValue: 0,
      endValue: 1,
      elapsed: 0,
      duration: 600,
      loop: "pingpong",
      loopCount: 2,
      easing: animations.easeInOutElastic,
      updateCallback: (t: number) => {
        bookScaleComponent.x = math.lerp(1, 1.2, t);
        bookScaleComponent.y = math.lerp(1, 1.2, t);
      },
    };

    wordTextAnimationComponent.addAnimation({
      startValue: 0,
      endValue: 1,
      elapsed: 0,
      duration: 600,
      updateCallback: (t: number) => {
        wordTextRenderSource.fontSize = math.lerp(
          styles.wordDisplayPanel.fontSize,
          0,
          t
        );
        wordTextPositionComponent.x = math.lerp(
          styles.wordDisplayPanel.position.x,
          styles.book.position.x,
          t
        );
        wordTextPositionComponent.y = math.lerp(
          styles.wordDisplayPanel.position.y,
          styles.book.position.y,
          t
        );
      },
      easing: animations.easeInBack,
      finishedCallback: () => {
        wordTextRenderSource.fontSize = 60;
        wordTextPositionComponent.x = styles.wordDisplayPanel.position.x;
        wordTextPositionComponent.y = styles.wordDisplayPanel.position.y;
        wordComponent.word = "";
        bookAnimationComponent.addAnimation(bookConsumeAnimation);
      },
    });

    makeRpc<ChainCompleteRpcRequest, ChainCompleteRpcResponse>(
      rpc_chainComplete,
      { tiles },
      ({ word, score, reason, leaderboard }) => {
        const date = new Date();

        options.leaderboardUpdater.update(leaderboard);

        const wordTextRenderSource = new rendering.TextRenderSource(
          word,
          styles.sidePanel.width - styles.sidePanel.padding.x * 2,
          styles.sidePanel.width - styles.sidePanel.padding.x * 2 - 40,
          "Share Tech Mono",
          18,
          reason === "new" ? styles.colors.primary : styles.colors.grey,
          "start"
        );

        const scoreTextRenderSource = new rendering.TextRenderSource(
          `+${score.toString()}`,
          styles.sidePanel.width - styles.sidePanel.padding.x * 2,
          styles.sidePanel.width - styles.sidePanel.padding.x,
          "Share Tech Mono",
          18,
          reason === "new" ? styles.colors.white : styles.colors.grey,
          "end"
        );

        const scoreHistoryRenderSource = new rendering.CompositeRenderSource({
          word: wordTextRenderSource,
          score: scoreTextRenderSource,
        });

        const wordEntity = new ecs.Entity(`word (${word},${score},${date})`, [
          new rendering.SpriteComponent(
            scoreHistoryRenderSource,
            options.renderLayer.name,
            { anchor: math.Vector2.zero() }
          ),
          new common.PositionComponent(),
        ]);

        options.wordsCollection.unshift(wordEntity);
        options.world.addEntity(wordEntity);
      }
    );
  };
}
