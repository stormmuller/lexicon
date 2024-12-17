import { animations, common, ecs, math, rendering } from "@gameup/engine";

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
        opacity: 0
      }
    );

  const positionComponent = new common.PositionComponent(
    window.innerWidth - 100,
    110
  );
  
  const rotationComponent = new common.RotationComponent(0);

  const animationComponent = new animations.AnimationComponent([
    {
      startValue: 110,
      endValue: 250,
      elapsed: 0,
      duration: 20 * 1000,
      updateCallback: (value: number) => {
        positionComponent.y = value
      },
      loop: "pingpong",
      easing: animations.easeInOutSine,
    },
    {
      startValue: 0,
      endValue: math.degreesToRadians(-20),
      elapsed: 0,
      duration: 40 * 1000,
      updateCallback: (value: number) => {
        rotationComponent.radians = value
      },
      loop: "pingpong",
      easing: animations.easeInOutBack,
    },
    {
      startValue: 0,
      endValue: 1,
      elapsed: 0,
      duration: 1000,
      updateCallback: (value: number) => {
        astronautRenderSource.renderEffects.opacity = value;
      },
      easing: animations.easeInOutSine,
    }
  ]);

  const astronautEntity = new ecs.Entity("astronaut art", [
    positionComponent,
    new common.ScaleComponent(),
    rotationComponent,
    new rendering.SpriteComponent(astronautRenderSource, renderLayer.name),
    animationComponent
  ]);

  world.addEntity(astronautEntity);
}
