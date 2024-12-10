import { ecs, input } from "@gameup/engine";

export const createInputs = (world: ecs.World, gameContainer: HTMLElement) => {
  const inputsEntity = new ecs.Entity("input", [new input.InputsComponent()]);

  const inputSystem = new input.InputSystem(gameContainer);
  const mousePointerSystem = new input.MousePointerSystem();

  world.addEntity(inputsEntity);

  world.addSystems([inputSystem, mousePointerSystem]);

  return inputsEntity;
};
