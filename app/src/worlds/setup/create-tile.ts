import { common, ecs, math, physics, rendering } from "@gameup/engine";
import { config } from "../../game.config";
import { styles } from "../../styles";
import { ChainableComponent } from "../../chain";
import { createLetter } from "./create-letter";
import { HoverComponent } from "../../hoverable";
import { TileComponent } from "../../tile";

export async function createTile(
  letter: string,
  x: number,
  y: number,
  normalRenderLayer: rendering.RenderLayer,
  focusedRenderLayer: rendering.RenderLayer,
  world: ecs.World
) {
  const gridWidth =
    config.gridSize.x * (styles.tile.size + styles.tile.gap) - styles.tile.gap;
  const remainingXSpace = window.innerWidth - gridWidth;
  const xOffset = remainingXSpace / 2;

  const calculatedX =
    x * (styles.tile.size + styles.tile.gap) +
    xOffset +
    styles.tile.size / 2;
  const calculatedY =
    y * (styles.tile.size + styles.tile.gap) + config.yOffset;

  const tileImageRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.tile.size,
    styles.tile.size,
    styles.tile.borderRaduis,
    styles.tile.backgroundColor
  );
  
  const tileHoverImageRenderSource = new rendering.RoundedRectangleRenderSource(
    styles.tile.size,
    styles.tile.size,
    styles.tile.borderRaduis,
    styles.tile.hover.backgroundColor
  );

  const boundingBox = new math.BoundingBox(
    new math.Vector2(
      calculatedX - styles.tile.size / 2,
      calculatedY - styles.tile.size / 2
    ),
    new math.Vector2(styles.tile.size, styles.tile.size)
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

    scale.set(scale.add(new math.Vector2(0.5, 0.5)));
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

    scale.set(scale.subtract(new math.Vector2(0.5, 0.5)));
  }

  const tileEntity = new ecs.Entity(`tile [${x};${y}]`, [
    new common.PositionComponent(calculatedX, calculatedY),
    new common.RotationComponent(0),
    new common.ScaleComponent(
      styles.tile.size / tileImageRenderSource.width,
      styles.tile.size / tileImageRenderSource.height
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
    styles.tile.size - 10,
    `tile [${x};${y}]`
  );
}
