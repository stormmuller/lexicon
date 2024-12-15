import { PositionComponent, ScaleComponent } from '../../common';
import { Entity, System } from '../../ecs';
import { Vector2 } from '../../math';
import { SpriteComponent } from '../components';
import { LayoutBoxComponent } from '../components/layout-box-component';

export class LayoutSystem extends System {
  constructor() {
    super('layout', [
      LayoutBoxComponent.symbol,
      SpriteComponent.symbol, // TODO: need a bounding box, but not necessarily a sprite
      PositionComponent.symbol,
    ]);
  }

  async run(entity: Entity): Promise<void> {
    const layoutBoxComponent = entity.getComponentRequired<LayoutBoxComponent>(
      LayoutBoxComponent.symbol,
    );

    const layoutPositionComponent =
      entity.getComponentRequired<PositionComponent>(PositionComponent.symbol);

    const layoutSpriteComponent = entity.getComponentRequired<SpriteComponent>(
      SpriteComponent.symbol,
    );

    const { sortedEntities } = layoutBoxComponent;
    const { renderSource: layoutRenderSource } = layoutSpriteComponent;

    // The maximum height we can use for laying out entities.
    const maxHeight = layoutRenderSource.boundingBox.maxY;
    const margin = layoutBoxComponent.margin;
    const spaceBetween = layoutBoxComponent.spaceBetween;

    const count = sortedEntities.length;

    // We want to ensure that we display as many of the last entities as possible,
    // starting from the bottom and working upwards until we run out of space.
    let totalHeightUsed = 0;
    let visibleCount = 0;

    // Measure from the bottom (end of the array) upwards to determine how many fit.
    for (let i = count - 1; i >= 0; i--) {
      const entity = sortedEntities[i];
      const sprite = entity.getComponentRequired<SpriteComponent>(
        SpriteComponent.symbol,
      );
      const entityHeight = sprite.renderSource.boundingBox.maxY + spaceBetween;

      if (totalHeightUsed + entityHeight > maxHeight) {
        break; // no more can fit
      }

      totalHeightUsed += entityHeight;
      visibleCount++;
    }

    // Now we know how many entities from the bottom can be visible.
    // Layout only those last 'visibleCount' entities, disabling the rest.

    // Calculate the starting position from the top, but we will
    // skip rendering the first (count - visibleCount) entities.
    const startIndex = count - visibleCount;

    // Place entities starting from the top. The offset accumulates downward.
    // Initially offset is just margin.y for the top spacing.
    let offsetY = margin.y;

    for (let i = 0; i < count; i++) {
      const entity = sortedEntities[i];
      const spriteComponent = entity.getComponentRequired<SpriteComponent>(
        SpriteComponent.symbol,
      );
      const positionComponent = entity.getComponentRequired<PositionComponent>(
        PositionComponent.symbol,
      );

      if (i < startIndex) {
        // These entities won't fit in the current layout height, so hide them
        spriteComponent.enabled = false;
        continue;
      }

      // These entities are visible
      spriteComponent.enabled = true;

      const entityHeight = spriteComponent.renderSource.boundingBox.maxY;

      const newY =
        layoutPositionComponent.y -
        layoutSpriteComponent.anchor.y +
        offsetY +
        entityHeight;
      const newX = layoutPositionComponent.x + margin.x;

      positionComponent.set(new Vector2(newX, newY));

      // Update offset for the next entity below
      offsetY += entityHeight + spaceBetween;
    }
  }
}
