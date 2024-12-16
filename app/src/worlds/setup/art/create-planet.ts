import { common, ecs, rendering } from "@gameup/engine";

export async function createPlanet(
  imageCache: rendering.ImageCache,
  renderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  const planetRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "planet.png",
      1,
      {
        glow: {
          color: "rgba(0,0,0,0.25)",
          radius: 15,
        },
      }
    );

  const planetEntity = new ecs.Entity("planet art", [
    new common.PositionComponent(window.innerWidth - 100, window.innerHeight),
    new common.ScaleComponent(),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(planetRenderSource, renderLayer.name),
  ]);

  world.addEntity(planetEntity);
}
