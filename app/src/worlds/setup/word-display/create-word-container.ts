import { common, ecs, rendering } from "@gameup/engine";
import { styles } from "../../../styles";

export function createWordContainer(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.wordDisplayPanel.width,
    styles.wordDisplayPanel.height,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const entity = new ecs.Entity("word container", [
    new common.PositionComponent(
      styles.wordDisplayPanel.position.x,
      styles.wordDisplayPanel.position.y
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
