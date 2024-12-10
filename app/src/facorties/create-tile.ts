import { common, ecs, math, physics, rendering } from "@gameup/engine";
import { config } from "../game.config";
import { HoverComponent, TileComponent } from "../board";
import { createLetter } from "./create-letter";
import { styles } from "../styles";
import { ChainableComponent } from "../chain";

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
    config.gridSize.x * (styles.board.tileSize + styles.board.tileGap) -
    styles.board.tileGap;
  const remainingXSpace = window.innerWidth - gridWidth;
  const xOffset = remainingXSpace / 2;

  const calculatedX =
    x * (styles.board.tileSize + styles.board.tileGap) +
    xOffset +
    styles.board.tileSize / 2;
  const calculatedY =
    y * (styles.board.tileSize + styles.board.tileGap) + config.yOffset;

  const tileImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(imageCache, "./Tile.png");
  const tileHoverImageRenderSource =
    await rendering.ImageRenderSource.fromImageCache(
      imageCache,
      "./Tile-hover.png"
    );

  const boundingBox = new math.BoundingBox(
    new math.Vector2(
      calculatedX - styles.board.tileSize / 2,
      calculatedY - styles.board.tileSize / 2
    ),
    new math.Vector2(styles.board.tileSize, styles.board.tileSize)
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

    if (common.isNil(chainable?.chain)) {
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

    if (common.isNil(chainable?.chain)) {
      sprite.renderSource = tileImageRenderSource;
      sprite.renderLayerName = normalRenderLayer.name;
    }

    scale.set(scale.subtract(new math.Vector2(0.1, 0.1)));
  }

  const tileEntity = new ecs.Entity(`tile [${x};y${y}]`, [
    new common.PositionComponent(calculatedX, calculatedY),
    new common.RotationComponent(0),
    new common.ScaleComponent(
      styles.board.tileSize / tileImageRenderSource.width,
      styles.board.tileSize / tileImageRenderSource.height
    ),
    new rendering.SpriteComponent(
      tileImageRenderSource,
      normalRenderLayer.name
    ),
    new TileComponent(letter, x, y),
    new HoverComponent(onHoverStart, onHoverEnd),
    new physics.BoxColliderComponent(boundingBox),
    new ChainableComponent(),
  ]);

  world.addEntity(tileEntity);

  await createLetter(
    focusedRenderLayer,
    world,
    calculatedX,
    calculatedY,
    letter,
    styles.board.tileSize - 10,
    `tile [${x};${y}]`
  );
}
