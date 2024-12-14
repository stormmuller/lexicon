import { ecs, rendering } from "@gameup/engine";
import { createLeaderboard } from "./create-leaderboard";

export function createUI(
  world: ecs.World,
  renderLayer: rendering.RenderLayer,
) {
  createLeaderboard(world, renderLayer);
}
