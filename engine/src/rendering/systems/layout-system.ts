import { PositionComponent, ScaleComponent } from '../../common';
import { Entity, System } from '../../ecs';
import { Vector2 } from '../../math';
import { SpriteComponent } from '../components';
import { LayoutBoxComponent } from '../components/layout-box-component';

export class LayoutSystem extends System {
  constructor() {
    super('layout', [
      LayoutBoxComponent.symbol,
      SpriteComponent.symbol, // TODO: we need a bounding box, but not nessarily a sprite
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

    const offset = new Vector2();

    for (const entity of layoutBoxComponent.sortedEntities) {
      const spriteComponent = entity.getComponentRequired<SpriteComponent>(
        SpriteComponent.symbol,
      );

      const positionComponent = entity.getComponentRequired<PositionComponent>(
        PositionComponent.symbol,
      );

      const { anchor, renderSource } = spriteComponent;

      const relativeYPosition = offset.y + renderSource.boundingBox.maxY;
      console.log(`anchor ${anchor}`);
      offset.y += renderSource.boundingBox.maxY + layoutBoxComponent.spaceBetween;

      const newY = layoutPositionComponent.y - layoutSpriteComponent.anchor.y + relativeYPosition;

      // const relativeXPosition = offset.x + renderSource.boundingBox.minY + anchor.x;
      // offset.x += relativeXPosition;
      const newX = layoutPositionComponent.x;

      positionComponent.set(new Vector2(newX, newY));
    }
  }
}
