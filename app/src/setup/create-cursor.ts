import { common, ecs, input, rendering } from '@gameup/engine';

export const createCursor = async (
  world: ecs.World,
  imageCache: rendering.ImageCache,
  renderLayer: rendering.RenderLayer,
) => {
  const path = `./pointer_scifi_a.png`;
  const image = await imageCache.getOrLoad(path);
  const renderSource = new rendering.ImageRenderSource(image);

  const cursor = new ecs.Entity('cursor', [
    new common.PositionComponent(),
    new common.ScaleComponent(0.5, 0.5),
    new input.CursorComponent(),
    new rendering.SpriteComponent(renderSource, renderLayer.name),
  ]);

  world.addEntity(cursor);

  return cursor;
};
