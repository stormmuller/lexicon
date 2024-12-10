import { common, ecs, game, rendering } from "@gameup/engine";
import { config } from "../game.config";

export const createCameras = (
  world: ecs.World,
  worldSpace: common.Space,
  inputsEntity: ecs.Entity,
  game: game.Game
) => {
  const worldCamera = new ecs.Entity("World Camera", [
    new rendering.CameraComponent(config.camera),
    new common.PositionComponent(worldSpace.center.x, worldSpace.center.y),
  ]);

  const uiCamera = new ecs.Entity("UI Camera", [
    rendering.CameraComponent.createDefaultCamera(true),
    new common.PositionComponent(worldSpace.center.x, worldSpace.center.y),
  ]);

  const cameraSystem = new rendering.CameraSystem(inputsEntity, game.time);

  world.addEntities([worldCamera, uiCamera]);
  world.addSystem(cameraSystem);

  return { worldCamera, uiCamera };
};
