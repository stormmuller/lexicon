import { common, ecs, math, rendering } from "@gameup/engine";
import { styles } from "../../../styles";

export function createWordHistory(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.sidePanel.width,
    styles.sidePanel.height,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const words = new Array<ecs.Entity>();

  const wordHistoryContainerEntity = new ecs.Entity("word history container", [
    new common.PositionComponent(
      window.innerWidth / 2 +
        styles.board.width / 2 +
        styles.sidePanel.width / 2 +
        styles.sidePanel.margin,
      styles.board.height / 2 + styles.board.marginTop - styles.tile.size / 2
    ),
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

  world.addEntities([wordHistoryContainerEntity]);

  return { wordHistoryContainerEntity, words };
}
