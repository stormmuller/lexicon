import { common, ecs, math, rendering } from "@gameup/engine";
import { styles } from "../../../styles";
import { createEntries } from "./create-entry";

export function createLeaderboard(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer,
  foregroundRenderLayer: rendering.RenderLayer
) {
  const leaderBoardPanelRenderSource =
    new rendering.RoundedRectangleRenderSource(
      styles.sidePanel.width,
      styles.sidePanel.height,
      styles.panel.borderRaduis,
      styles.panel.backgroundColor
    );

  const leaderBoardEntryEntities = createEntries(
    foregroundRenderLayer,
    backgroundRenderLayer,
    world
  );

  const leaderboardEntity = new ecs.Entity("leaderboard container", [
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
    new rendering.LayoutBoxComponent(
      leaderBoardEntryEntities,
      leaderBoardPanelRenderSource.boundingBox,
      0,
      new math.Vector2(0, styles.sidePanel.padding.y)
    ),
  ]);

  world.addEntity(leaderboardEntity);

  return { leaderboardEntity, leaderBoardEntryEntities };
}
