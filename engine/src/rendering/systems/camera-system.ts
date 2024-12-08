import { PositionComponent, Time } from '../../common';
import * as math from '../../math';
import { Entity, System } from '../../ecs';
import { InputsComponent, keyCodes } from '../../input';
import { CameraComponent } from '../components';

export class CameraSystem extends System {
  private _inputComponent: InputsComponent;
  private _time: Time;

  constructor(inputEntity: Entity, time: Time) {
    super('camera', [CameraComponent.symbol, PositionComponent.symbol]);

    this._inputComponent = inputEntity.getComponent(
      InputsComponent.symbol,
    ) as InputsComponent;
    this._time = time;
  }

  async run(entity: Entity): Promise<void> {
    const cameraComponent = entity.getComponent(
      CameraComponent.symbol,
    ) as CameraComponent;

    if (cameraComponent.isStatic) {
      return;
    }

    const position = entity.getComponent(
      PositionComponent.symbol,
    ) as PositionComponent;

    if (cameraComponent.allowZooming) {
      cameraComponent.zoom = math.clamp(
        cameraComponent.zoom -
          this._inputComponent.scrollDelta * cameraComponent.zoomSensitivity,
        cameraComponent.minZoom,
        cameraComponent.maxZoom,
      );
    }

    if (cameraComponent.allowPanning) {
      const zoomPanMultiplier =
        cameraComponent.panSensitivity * (1 / cameraComponent.zoom) +
        this._time.rawDeltaTime;

      if (this._inputComponent.keyPressed(keyCodes.W)) {
        position.y -= zoomPanMultiplier;
      }

      if (this._inputComponent.keyPressed(keyCodes.S)) {
        position.y += zoomPanMultiplier;
      }

      if (this._inputComponent.keyPressed(keyCodes.A)) {
        position.x -= zoomPanMultiplier;
      }

      if (this._inputComponent.keyPressed(keyCodes.D)) {
        position.x += zoomPanMultiplier;
      }
    }
  }
}
