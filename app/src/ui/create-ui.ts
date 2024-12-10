import { ecs, rendering } from "@gameup/engine";
import { createWordContainer } from "./create-word-container";
import { createLeaderboard } from "./create-leaderboard";
import { createWordHistory } from "./create-word-history";

export function createUI(
  world: ecs.World,
  backgroundRenderLayer: rendering.RenderLayer,
) {
  createWordContainer(world, backgroundRenderLayer);
  createLeaderboard(world, backgroundRenderLayer);
  createWordHistory(world, backgroundRenderLayer);
}
