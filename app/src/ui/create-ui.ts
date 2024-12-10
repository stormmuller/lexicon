import { ecs, rendering } from "@gameup/engine";
import { createWordContainer } from "./create-word-container";
import { createLeaderboard } from "./create-leaderboard";
import { createWordHistory } from "./create-word-history";

export function createUI(
  world: ecs.World,
  renderLayer: rendering.RenderLayer,
) {
  createWordContainer(world, renderLayer);
  createLeaderboard(world, renderLayer);
  createWordHistory(world, renderLayer);
}
