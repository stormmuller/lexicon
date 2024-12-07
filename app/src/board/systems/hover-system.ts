import { common, ecs, math, physics, rendering } from "@gameup/engine";
import { InteractiableComponent, InteratiableState } from "../components";

export class HoverSystem extends ecs.System {
  private _mouseCoordinates = new math.Vector2();
  private _camera: rendering.CameraComponent;
  private _cameraPosition: common.PositionComponent;
  private _worldSpace: common.Space;

  constructor(camera: ecs.Entity, worldSpace: common.Space) {
    super("hover", [
      InteractiableComponent.symbol,
      physics.BoxColliderComponent.symbol,
    ]);

    window.addEventListener("mousemove", this.updateCursorPosition, {
      passive: true,
    });

    this._camera = camera.getComponent(
      rendering.CameraComponent.symbol
    ) as rendering.CameraComponent;
    this._cameraPosition = camera.getComponent(
      common.PositionComponent.symbol
    ) as common.PositionComponent;
    this._worldSpace = worldSpace;
  }

  updateCursorPosition = (event: MouseEvent) => {
    this._mouseCoordinates.x = event.clientX;
    this._mouseCoordinates.y = event.clientY;
  };

  async run(entity: ecs.Entity): Promise<void> {
    const interactiableComponent = entity.getComponent(
      InteractiableComponent.symbol
    ) as InteractiableComponent;

    const boxColliderComponent = entity.getComponent(
      physics.BoxColliderComponent.symbol
    ) as physics.BoxColliderComponent;

    // const normalizedMouseCoordinates = this._mouseCoordinates
    //   .add(this._worldSpace.center) // Adjust to the center of the canvas
    //   .divide(this._camera.zoom) // Scale down based on zoom
    //   .add(this._cameraPosition); // Offset by camera position

    // Subtract the worldSpace center first
    let worldCoords = this._mouseCoordinates.subtract(this._worldSpace.center);

    // Now invert the scale
    worldCoords = worldCoords.divide(this._camera.zoom);

    // Now invert the camera translation
    worldCoords = worldCoords
      .add(this._cameraPosition)
      .add(this._worldSpace.center.divide(this._camera.zoom));

    if (
      interactiableComponent.state !== InteratiableState.hovered &&
      boxColliderComponent.boundingBox.contains(worldCoords)
    ) {
      interactiableComponent.state = InteratiableState.hovered;
      interactiableComponent.onHoverStart(entity);
      return;
    }

    if (
      interactiableComponent.state === InteratiableState.hovered &&
      !boxColliderComponent.boundingBox.contains(worldCoords)
    ) {
      interactiableComponent.state = InteratiableState.none;
      interactiableComponent.onHoverEnd(entity);
      return;
    }
  }

  shutdown(): void {
    window.removeEventListener("mousemove", this.updateCursorPosition);
  }
}
