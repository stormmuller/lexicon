import { ecs, input } from '@gameup/engine';

export const createInputs = (world: ecs.World) => {
  const inputs = new ecs.Entity('input', [new input.InputsComponent()]);

  world.addEntity(inputs);

  return inputs;
};
