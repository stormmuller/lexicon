import { common, ecs, rendering } from '@gameup/engine';

export const createCameras = (world: ecs.World, worldSpace: common.Space) => {
  const worldCamera = new ecs.Entity('World Camera', [
    new rendering.CameraComponent({
      minZoom: 0.15,
      maxZoom: 1
    }),
    new common.PositionComponent(
      -worldSpace.center.x / 2,
      -worldSpace.center.x / 2,
    ),
  ]);

  const uiCamera = new ecs.Entity('UI Camera', [
    rendering.CameraComponent.createDefaultCamera(true),
    new common.PositionComponent(worldSpace.center.x, worldSpace.center.y),
  ]);

  world.addEntities([worldCamera, uiCamera]);

  return { worldCamera, uiCamera };
};
