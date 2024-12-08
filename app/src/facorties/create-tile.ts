import { common, ecs, math, physics, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { ChainableComponent, HoverComponent, TileComponent } from "../board";
import { createLetter } from "./create-letter";

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
  const calculatedY = y * (config.tileSize + config.padding) + config.yOffset;

  const tileImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(imageCache, "./Tile.png");
  const tileHoverImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "./Tile-hover.png"
    );
  const tileChainImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "./Tile-chain.png"
    );

  const boundingBox = new math.BoundingBox(
    new math.Vector2(
      calculatedX - config.tileSize / 2,
      calculatedY - config.tileSize / 2
    ),
    new math.Vector2(config.tileSize, config.tileSize)
  );

  function onHoverStart(entity: ecs.Entity) {
    const chainable = entity.getComponent<ChainableComponent>(
      ChainableComponent.symbol
    );

    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    const scale = entity.getComponent(
      common.ScaleComponent.symbol
    ) as common.ScaleComponent;


    if (!chainable?.isPartOfChain) {
      sprite.renderSource = tileHoverImageRenderSource;
      sprite.renderLayerName = focusedRenderLayer.name;
    }

    scale.set(scale.add(new math.Vector2(0.1, 0.1)));
  }

  function onHoverEnd(entity: ecs.Entity) {
    const chainable = entity.getComponent<ChainableComponent>(
      ChainableComponent.symbol
    );

    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    const scale = entity.getComponent(
      common.ScaleComponent.symbol
    ) as common.ScaleComponent;

    if (!chainable?.isPartOfChain) {
      sprite.renderSource = tileImageRenderSource;
      sprite.renderLayerName = normalRenderLayer.name;
    }

    scale.set(scale.subtract(new math.Vector2(0.1, 0.1)));
  }

  function onAddedToChain(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = tileChainImageRenderSource;
    sprite.renderLayerName = focusedRenderLayer.name;
  }

  function onRemovedFromChain(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = tileImageRenderSource;
    sprite.renderLayerName = normalRenderLayer.name;
  }

  const tileEntity = new ecs.Entity(`tile [${x};y${y}]`, [
    new common.PositionComponent(calculatedX, calculatedY),
    new common.RotationComponent(0),
    new common.ScaleComponent(
      config.tileSize / tileImageRenderSource.width,
      config.tileSize / tileImageRenderSource.height
    ),
    new rendering.SpriteComponent(
      tileImageRenderSource,
      normalRenderLayer.name
    ),
    new TileComponent(letter, x, y),
    new HoverComponent(onHoverStart, onHoverEnd),
    new physics.BoxColliderComponent(boundingBox),
    new ChainableComponent(onAddedToChain, onRemovedFromChain),
  ]);

  world.addEntity(tileEntity);

  await createLetter(
    focusedRenderLayer,
    world,
    calculatedX,
    calculatedY,
    letter,
    config.tileSize - 10,
    `tile [${x};${y}]`
  );
}
