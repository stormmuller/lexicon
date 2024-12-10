import { common, ecs, rendering } from "@gameup/engine";
import { config } from "../game.config";

export function createWordContainer(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const boardWidth =
    (config.tileSize + config.padding) * config.gridSize.x - config.padding;

  const containerHeight = 100;
  const containerMargin = 20;
  const conainerToBoardPadding = 100;

  const wordContainerRenderSource = new rendering.RoundedRectangleRenderSource(
    boardWidth + conainerToBoardPadding,
    containerHeight,
    10,
    "rgba(0, 0, 0, 0.6)"
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
