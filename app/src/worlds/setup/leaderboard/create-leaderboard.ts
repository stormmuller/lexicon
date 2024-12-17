import { common, ecs, math, rendering, timer } from "@gameup/engine";
import { styles } from "../../../styles";
import { createEntries } from "./create-entry";
import { LeaderboardUpdater } from "../../../leaderboard";
import { makeRpc } from "../../../rpc";
import {
  GetLeaderboardRpcRequest,
  GetLeaderboardRpcResponse,
  rpc_getLeaderboard,
} from "@lexicon/common";
import { config } from "../../../game.config";

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

  const leaderboardUpdater = new LeaderboardUpdater(leaderBoardEntryEntities);
  const periodicLeaderboardUpdateComponent = new timer.TimerComponent([
    {
      callback: updateLeaderboard(leaderboardUpdater),
      delay: config.leaderboardRefresh,
      repeat: true,
      interval: config.leaderboardRefresh,
      elapsed: 0
    },
  ]);

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
    periodicLeaderboardUpdateComponent
  ]);

  world.addEntity(leaderboardEntity);

  updateLeaderboard(leaderboardUpdater)();

  return { leaderboardEntity, leaderBoardEntryEntities, leaderboardUpdater };
}

function updateLeaderboard(leaderboardUpdater: LeaderboardUpdater) {
  return () => {
    makeRpc<GetLeaderboardRpcRequest, GetLeaderboardRpcResponse>(
      rpc_getLeaderboard,
      null,
      ({ leaderboard }) => {
        leaderboardUpdater.update(leaderboard);
      }
    );
  };
}
