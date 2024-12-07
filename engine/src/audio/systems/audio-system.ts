import { SoundComponent } from '../components';
import { Entity, System } from '../../ecs';

export class AudioSystem extends System {
  constructor() {
    super('sound', [SoundComponent.symbol]);
  }

  async run(entity: Entity): Promise<void> {
    const soundComponent = entity.getComponent(
      SoundComponent.symbol,
    ) as SoundComponent;

    if (soundComponent.playSound) {
      soundComponent.sound.play();
      soundComponent.playSound = false;
    }
  }
}
