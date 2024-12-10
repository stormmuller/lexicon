import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";

export function createWordHistory(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const boardWidth =
    (config.tileSize + config.padding) * config.gridSize.x - config.padding;
  const boardHeight =
    (config.tileSize + config.padding) * config.gridSize.y - config.padding;

  const containerBoardHeightDiff = 50;
  const containerMargin = 20;
  const wordHistoryContainerWidth = 140;

  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    wordHistoryContainerWidth,
    boardHeight - containerBoardHeightDiff,
    10,
    "rgba(0, 0, 0, 0.6)"
  );

  const container = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2 + boardWidth / 2 + wordHistoryContainerWidth / 2 + containerMargin,
      boardHeight / 2 + config.yOffset - config.tileSize / 2 
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
