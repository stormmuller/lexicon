import { ecs, rendering } from "@gameup/engine";
import { createAstronaut } from "./create-astronaut";
import { createRocket } from "./create-rocket";
import { createPlanet } from "./create-planet";

export async function createArt(
  imageCache: rendering.ImageCache,
  renderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  await Promise.all([
    createAstronaut(imageCache, renderLayer, world),
    createRocket(imageCache, renderLayer, world),
    createPlanet(imageCache, renderLayer, world),
  ]);
}
