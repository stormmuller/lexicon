import { common, ecs, rendering } from "@gameup/engine";

export const createCameras = (world: ecs.World, worldSpace: common.Space) => {

  const worldCamera = new ecs.Entity("World Camera", [
    new rendering.CameraComponent({
      minZoom: 0.8,
      maxZoom: 1.7,
      // allowPanning: false
    }),
    new common.PositionComponent(worldSpace.center.x, worldSpace.center.y),
  ]);

  const uiCamera = new ecs.Entity("UI Camera", [
    rendering.CameraComponent.createDefaultCamera(true),
    new common.PositionComponent(worldSpace.center.x, worldSpace.center.y),
  ]);

  world.addEntities([worldCamera, uiCamera]);

  return { worldCamera, uiCamera };
};
