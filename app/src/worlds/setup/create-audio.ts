import { audio, ecs } from '@gameup/engine';

export const createAudio = (world: ecs.World, soundName: string) => {
  const soundPath = `${soundName}`;

  const music = new ecs.Entity('music', [
    new audio.SoundComponent(
      {
        src: soundPath,
        loop: true,
      },
      true,
    ),
  ]);

  world.addEntity(music);

  return music;
};
