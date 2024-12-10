import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { styles } from "../styles";

export function createLeaderboard(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const boardWidth =
    (styles.board.tileSize + styles.board.tileGap) * config.gridSize.x - styles.board.tileGap;
  const boardHeight =
    (styles.board.tileSize + styles.board.tileGap) * config.gridSize.y - styles.board.tileGap;

  const containerBoardHeightDiff = 50;
  const containerMargin = 20;
  const leaderboardWidth = 140;

  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    leaderboardWidth,
    boardHeight - containerBoardHeightDiff,
    10,
    "rgba(0, 0, 0, 0.6)"
  );

  const container = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2 - boardWidth / 2 - leaderboardWidth / 2 - containerMargin,
      boardHeight / 2 + config.yOffset - styles.board.tileSize / 2 
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
