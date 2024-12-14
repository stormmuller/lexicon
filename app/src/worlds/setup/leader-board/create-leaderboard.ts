import { common, ecs, rendering } from "@gameup/engine";
import { styles } from "../../../styles";

export function createLeaderboard(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const leaderBoardPanelRenderSource =
    new rendering.RoundedRectangleRenderSource(
      styles.sidePanel.width,
      styles.sidePanel.height,
      styles.panel.borderRaduis,
      styles.panel.backgroundColor
    );

  const container = new ecs.Entity("word container", [
    new common.PositionComponent(
      window.innerWidth / 2 -
        styles.board.width / 2 -
        styles.sidePanel.width / 2 -
        styles.sidePanel.margin,
      styles.board.height / 2 + styles.board.marginTop - styles.tile.size / 2
    ),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(
      leaderBoardPanelRenderSource,
      backgroundRenderLayer.name
    ),
  ]);

  world.addEntity(container);

  return container;
}
