import { animations, common, ecs, rendering } from "@gameup/engine";

export async function createRocket(
  imageCache: rendering.ImageCache,
  renderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  const rocketRenderSource = await rendering.ImageRenderSource.fromImageCache(
    imageCache,
    "rocket.png",
    1,
    {
      glow: {
        color: "rgba(0,0,0,0.25)",
        radius: 15,
      },
      opacity: 0
    }
  );

  const astronautEntity = new ecs.Entity("rocket art", [
    new common.PositionComponent(100, window.innerHeight - 150),
    new common.ScaleComponent(0.5, 0.5),
    new common.RotationComponent(35),
    new rendering.SpriteComponent(rocketRenderSource, renderLayer.name),
    new animations.AnimationComponent([
      {
        startValue: 0,
        endValue: 1,
        elapsed: 0,
        duration: 1000,
        updateCallback: (value: number) => {
          rocketRenderSource.renderEffects.opacity = value;
        },
        easing: animations.easeInOutSine,
      },
    ]),
  ]);

  world.addEntity(astronautEntity);
}
