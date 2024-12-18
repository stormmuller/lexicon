import { animations, common, ecs, math, rendering } from "@gameup/engine";
import { styles } from "../../../styles";
import { makeRpc } from "../../../rpc";
import {
  GetWordHistoryRpcRequest,
  GetWordHistoryRpcResponse,
  rpc_getWordHistory,
} from "@lexicon/common";
import { WordHistoryUpdater } from "../../../word-history";

export async function createWordHistory(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer,
  foregroundRenderLayer: rendering.RenderLayer,
  imageCache: rendering.ImageCache
) {
  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.sidePanel.width,
    styles.sidePanel.height,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const words = new Array<ecs.Entity>();

  const wordHistoryContainerPositionComponent = new common.PositionComponent(
    styles.wordHistoryPanel.position.x,
    styles.wordHistoryPanel.position.y
  );

  const wordHistoryContainerEntity = new ecs.Entity("word history container", [
    wordHistoryContainerPositionComponent,
    new common.RotationComponent(0),
    new rendering.SpriteComponent(
      wordContainerRenderSource,
      backgroundRenderLayer.name
    ),
    new rendering.LayoutBoxComponent(
      words,
      wordContainerRenderSource.boundingBox,
      styles.wordHistoryPanel.spaceBetween,
      new math.Vector2(styles.sidePanel.padding.x, styles.sidePanel.padding.y),
      "start",
      "bottom"
    ),
  ]);

  const bookRenderSource = await rendering.ImageRenderSource.fromImageCache(
    imageCache,
    "book.png",
    1,
    { glow: { color: "rgba(0,0,0,0.6)", radius: 10 }, opacity: 0 }
  );

  const bookEntity = new ecs.Entity("book", [
    new common.PositionComponent(
      styles.book.position.x,
      styles.book.position.y
    ),
    new common.ScaleComponent(),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(bookRenderSource, foregroundRenderLayer.name),
    new animations.AnimationComponent([
      {
        startValue: 0,
        endValue: 1,
        elapsed: 0,
        duration: 1000,
        updateCallback: (value: number) => {
          bookRenderSource.renderEffects.opacity = value;
        },
        easing: animations.easeInOutSine,
      },
    ]),
  ]);

  const wordHistoryUpdater = new WordHistoryUpdater(
    words,
    foregroundRenderLayer,
    world
  );

  makeRpc<GetWordHistoryRpcRequest, GetWordHistoryRpcResponse>(
    rpc_getWordHistory,
    null,
    ({ history }) => {
      wordHistoryUpdater.set(history);
    }
  );

  world.addEntities([wordHistoryContainerEntity, bookEntity]);

  return { wordHistoryUpdater, bookEntity };
}
