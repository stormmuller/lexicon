import { common, ecs, math, physics, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { InteractiableComponent } from "../board";

export async function createTile(
  letter: string,
  x: number,
  y: number,
  imageCache: rendering.ImageCache,
  normalRenderLayer: rendering.RenderLayer,
  focusedRenderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  const gridWidth =
    config.gridSize.x * (config.tileSize + config.padding) - config.padding;
  const remainingXSpace = window.innerWidth - gridWidth;
  const xOffset = remainingXSpace / 2;

  const calculatedX =
    x * (config.tileSize + config.padding) + xOffset + config.tileSize / 2;
  const calculatedY = y * (config.tileSize + config.padding) + 100;

  const tileImage = await imageCache.getOrLoad("./Tile.png");
  const tileHoverImage = await imageCache.getOrLoad("./Tile-hover.png");
  const tileImageRenderSource = new rendering.ImageRenderSource(tileImage);
  const tileHoverImageRenderSource = new rendering.ImageRenderSource(
    tileHoverImage
  );  
  const textRenderSource = new rendering.TextRenderSource(
    letter,
    "Share Tech Mono",
    60,
    "white",
    new math.Vector2(config.tileSize * 1.5 + config.padding, config.tileSize * 1.5 + config.padding)
  );

  const normalRenderSoruce = new rendering.CompositeRenderSource([tileImageRenderSource, textRenderSource]);
  const hoverRenderSoruce = new rendering.CompositeRenderSource([tileHoverImageRenderSource, textRenderSource]);

  const boundingBox = new math.BoundingBox(
    new math.Vector2(calculatedX - config.tileSize / 2, calculatedY - config.tileSize / 2),
    new math.Vector2(config.tileSize, config.tileSize)
  );

  function onHoverStart(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    const scale = entity.getComponent(
      common.ScaleComponent.symbol
    ) as common.ScaleComponent;

    sprite.renderSource = hoverRenderSoruce;
    sprite.renderLayerName = focusedRenderLayer.name;
    scale.set(scale.add(new math.Vector2(0.1, 0.1)));
  }

  function onHoverEnd(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    const scale = entity.getComponent(
      common.ScaleComponent.symbol
    ) as common.ScaleComponent;

    sprite.renderSource = normalRenderSoruce;
    sprite.renderLayerName = normalRenderLayer.name;
    scale.set(scale.subtract(new math.Vector2(0.1, 0.1)));
  }

  const entity = new ecs.Entity(`tile [${x};y${y}]`, [
    new common.PositionComponent(calculatedX, calculatedY),
    new common.RotationComponent(0),
    new common.ScaleComponent(
      config.tileSize / normalRenderSoruce.width,
      config.tileSize / normalRenderSoruce.height
    ),
    new rendering.SpriteComponent(
      normalRenderSoruce,
      normalRenderLayer.name
    ),
    new InteractiableComponent(onHoverStart, onHoverEnd),
    new physics.BoxColliderComponent(boundingBox),
  ]);

  world.addEntity(entity);
}
