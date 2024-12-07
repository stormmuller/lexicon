import { Entity, System } from '../../ecs';
import { ProgressComponent } from '../components';

export class ProgressSystem extends System {
  constructor() {
    super('progress', [ProgressComponent.symbol]);
  }

  async run(entity: Entity): Promise<void> {
    const progressComponent = entity.getComponent(
      ProgressComponent.symbol,
    ) as ProgressComponent;

    console.log(progressComponent.calculateProgress());
  }
}
