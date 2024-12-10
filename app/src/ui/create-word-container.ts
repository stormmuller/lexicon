import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { styles } from "../styles";

export function createWordContainer(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const boardWidth =
    (styles.tile.size + styles.tile.gap) * config.gridSize.x - styles.tile.gap;

  const containerHeight = 100;
  const containerMargin = 20;
  const conainerToBoardPadding = 100;

  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    boardWidth + conainerToBoardPadding,
    containerHeight,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const container = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2,
      containerHeight / 2 + containerMargin
    ),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(
      wordContainerRenderSource,
      backgroundRenderLayer.name
    ),
  ]);

  world.addEntity(container);

  return container;
}
