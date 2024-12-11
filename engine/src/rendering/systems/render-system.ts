import {
  isNil,
  PositionComponent,
  RotationComponent,
  ScaleComponent,
  Space,
} from '../../common';
import { Entity, System } from '../../ecs';
import { CameraComponent, SpriteComponent } from '../components';
import { GlowEffect, RenderEffects } from '../render-sources';
import { ClearStrategy, RenderLayer } from '../types';

export class RenderSystem extends System {
  private _layer: RenderLayer;
  private _worldSpace: Space;
  private _cameraPosition: PositionComponent;
  private _camera: CameraComponent;

  constructor(layer: RenderLayer, cameraEntity: Entity, worldSpace: Space) {
    super('renderer', [PositionComponent.symbol, SpriteComponent.symbol]);

    this._layer = layer;
    this._worldSpace = worldSpace;

    const cameraPosition = cameraEntity.getComponent(
      PositionComponent.symbol,
    ) as PositionComponent;

    if (isNil(cameraPosition)) {
      throw new Error(
        `The 'camera' provided to the ${this.name} system during construction is missing the "${PositionComponent.name}" component`,
      );
    }

    const camera = cameraEntity.getComponent(
      CameraComponent.symbol,
    ) as CameraComponent;

    if (isNil(camera)) {
      throw new Error(
        `The 'camera' provided to the ${this.name} system during construction is missing the "${CameraComponent.name}" component`,
      );
    }

    this._cameraPosition = cameraPosition;
    this._camera = camera;
  }

  override beforeAll = async (entities: Entity[]) => {
    if (
      isNil(this._layer.clearStrategy) ||
      this._layer.clearStrategy === ClearStrategy.BLANK
    ) {
      this._layer.context.clearRect(
        0,
        0,
        this._layer.context.canvas.width,
        this._layer.context.canvas.height,
      );
    }

    const sortedEntities = entities.sort((entity1, entity2) => {
      const position1 = entity1.getComponent<PositionComponent>(
        PositionComponent.symbol,
      ) as PositionComponent;

      const spriteComponent1 = entity1.getComponent<SpriteComponent>(
        SpriteComponent.symbol,
      ) as SpriteComponent;

      const position2 = entity2.getComponent<PositionComponent>(
        PositionComponent.symbol,
      ) as PositionComponent;

      const spriteComponent2 = entity2.getComponent<SpriteComponent>(
        SpriteComponent.symbol,
      ) as SpriteComponent;

      return (
        position1.y -
        spriteComponent1.anchor.y -
        (position2.y - spriteComponent2.anchor.y)
      );
    });

    return sortedEntities;
  };

  async run(entity: Entity): Promise<void> {
    const spriteComponent = entity.getComponent<SpriteComponent>(
      SpriteComponent.symbol,
    ) as SpriteComponent;

    if (spriteComponent.renderLayerName !== this._layer.name) {
      return; // Probably not the best way to handle layers/sprite, but the alternatives have their own issues.
    }

    const position = entity.getComponent<PositionComponent>(
      PositionComponent.symbol,
    ) as PositionComponent;

    const scale = entity.getComponent<ScaleComponent>(
      ScaleComponent.symbol,
    ) as ScaleComponent;

    const rotation = entity.getComponent<RotationComponent>(
      RotationComponent.symbol,
    );

    this._layer.context.translate(
      this._worldSpace.center.x,
      this._worldSpace.center.y,
    );

    // Apply zoom and translate based on the camera position
    this._layer.context.scale(this._camera.zoom, this._camera.zoom);

    this._layer.context.translate(
      -this._cameraPosition.x,
      -this._cameraPosition.y,
    );

    // Translate to the position of the entity
    this._layer.context.translate(position.x, position.y);

    if (rotation) {
      this._layer.context.rotate(rotation.radians);
    }

    this._layer.context.scale(scale?.x ?? 1, scale?.y ?? 1);

    // Translate based on the anchor point of the sprite
    this._layer.context.translate(
      -spriteComponent.anchor.x,
      -spriteComponent.anchor.y,
    );

    this._renderPreProcessingEffects(
      spriteComponent.renderSource.renderEffects,
    );

    // Render the sprite
    spriteComponent.renderSource.render(this._layer);

    this._resetCanvas();
  }

  private _resetCanvas() {
    // Reset transformation matrix
    this._layer.context.setTransform(1, 0, 0, 1, 0, 0);

    // Reset filter
    this._layer.context.filter = 'none';

    // reset glow
    this._layer.context.shadowColor = "rgba(0, 0, 0, 0)";
    this._layer.context.shadowBlur = 0;
  }

  private _renderPreProcessingEffects(renderEffects: RenderEffects) {
    this._renderGlow(renderEffects.glow);
  }

  private _renderGlow(glow?: GlowEffect) {
    if (!glow) {
      return;
    }

    this._layer.context.shadowColor = glow.color;
    this._layer.context.shadowBlur = glow.radius;
  }
}
