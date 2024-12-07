import { common, ecs, math, physics, rendering } from "@gameup/engine";
import { InteractiableComponent } from "../board";

export async function createBlankTile(
  imageCache: rendering.ImageCache,
  layer: rendering.RenderLayer,
  world: ecs.World,
  x: number,
  y: number,
  name: string
) {
  const tileImage = await imageCache.getOrLoad("./Tile.png");
  const tileHoverImage = await imageCache.getOrLoad("./Tile-hover.png");
  const tileImageRenderSource = new rendering.ImageRenderSource(tileImage);
  const tileHoverImageRenderSource = new rendering.ImageRenderSource(
    tileHoverImage
  );

  const boundingBox = new math.BoundingBox(
    new math.Vector2(x - tileImage.width / 2, y - tileImage.height / 2),
    new math.Vector2(tileImage.width, tileImage.height)
  );

  function onHoverStart(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = tileHoverImageRenderSource;
  }

  function onHoverEnd(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = tileImageRenderSource;
  }

  const entity = new ecs.Entity(name, [
    new common.PositionComponent(x, y),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(tileImageRenderSource, layer.name),
    new InteractiableComponent(onHoverStart, onHoverEnd),
    new physics.BoxColliderComponent(boundingBox),
  ]);

  world.addEntity(entity);
}
