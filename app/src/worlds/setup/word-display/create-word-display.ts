import { ecs, rendering } from "@gameup/engine";
import { createWordContainer } from "./create-word-container";
import { createWordText } from "./create-word-text";

export function createWordDisplay(
  world: ecs.World,
  foregroundRenderLayer: rendering.RenderLayer,
  backgroundRenderLayer: rendering.RenderLayer
) {
  const wordContainerEntity = createWordContainer(world, backgroundRenderLayer);
  const wordTextEntity = createWordText(world, foregroundRenderLayer);

  return {
    wordContainerEntity,
    wordTextEntity,
  };
}
