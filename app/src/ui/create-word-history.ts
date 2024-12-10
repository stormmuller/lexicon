import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { styles } from "../styles";

export function createWordHistory(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const boardWidth =
    (styles.tile.size + styles.tile.gap) * config.gridSize.x - styles.tile.gap;
  const boardHeight =
    (styles.tile.size + styles.tile.gap) * config.gridSize.y - styles.tile.gap;

  const containerBoardHeightDiff = 50;
  const containerMargin = 20;
  const wordHistoryContainerWidth = 140;

  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    wordHistoryContainerWidth,
    boardHeight - containerBoardHeightDiff,
    styles.panel.borderRaduis,
    styles.panel.backgroundColor
  );

  const container = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2 + boardWidth / 2 + wordHistoryContainerWidth / 2 + containerMargin,
      boardHeight / 2 + config.yOffset - styles.tile.size / 2 
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
