import { common, ecs, rendering } from "@gameup/engine";
import { styles } from "../../../styles";

export function createWordContainer(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.wordHistoryPanel.width,
    styles.wordHistoryPanel.height,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const entity = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2,
      styles.wordHistoryPanel.height / 2 + styles.wordHistoryPanel.margin
    ),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(
      wordContainerRenderSource,
      backgroundRenderLayer.name
    ),
  ]);

  world.addEntity(entity);

  return entity;
}
