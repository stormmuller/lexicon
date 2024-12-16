import { common, ecs, rendering } from "@gameup/engine";

export async function createAstronaut(
  imageCache: rendering.ImageCache,
  renderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  const astronautRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "astronaut.png",
      1,
      {
        glow: {
          color: "rgba(0,0,0,0.25)",
          radius: 15,
        },
      }
    );

  const astronautEntity = new ecs.Entity("astronaut art", [
    new common.PositionComponent(window.innerWidth - 100, 110),
    new common.ScaleComponent(),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(astronautRenderSource, renderLayer.name),
  ]);

  world.addEntity(astronautEntity);
}
