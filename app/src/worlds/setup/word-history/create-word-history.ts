import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../../../game.config";
import { styles } from "../../../styles";

export function createWordHistory(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const containerBoardHeightDiff = 5;
  const containerMargin = 20;
  const wordHistoryContainerWidth = 180;

  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    wordHistoryContainerWidth,
    styles.board.height - containerBoardHeightDiff,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const container = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2 + styles.board.width / 2 + wordHistoryContainerWidth / 2 + containerMargin,
      styles.board.height / 2 + config.yOffset - styles.tile.size / 2 
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
