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
import { WordHistoryUpdater } from "../../../../word-history";

export function onChainComplete(options: {
  renderSource: rendering.RenderSource;
  renderLayer: rendering.RenderLayer;
  wordTextEntity: ecs.Entity;
  bookEntity: ecs.Entity;
  leaderboardUpdater: LeaderboardUpdater;
  wordHistoryUpdater: WordHistoryUpdater;
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
        options.leaderboardUpdater.update(leaderboard);
        options.wordHistoryUpdater.add({
          word,
          score,
          reason,
        });
      }
    );
  };
}
