import { common, ecs, input, physics, rendering } from "@gameup/engine";
import { HoverComponent } from "../components";

export class HoverSystem extends ecs.System {
  private _camera: rendering.CameraComponent;
  private _cameraPosition: common.PositionComponent;
  private _worldSpace: common.Space;
  private _inputComponent: input.InputsComponent;

  constructor(
    inputEntity: ecs.Entity,
    cameraEntity: ecs.Entity,
    worldSpace: common.Space
  ) {
    super("hover", [
      HoverComponent.symbol,
      physics.BoxColliderComponent.symbol,
    ]);

    this._inputComponent = inputEntity.getComponent(
      input.InputsComponent.symbol,
    ) as input.InputsComponent;

    this._camera = cameraEntity.getComponent(
      rendering.CameraComponent.symbol
    ) as rendering.CameraComponent;
    this._cameraPosition = cameraEntity.getComponent(
      common.PositionComponent.symbol
    ) as common.PositionComponent;
    this._worldSpace = worldSpace;
  }

  async run(entity: ecs.Entity): Promise<void> {
    const hoverComponent = entity.getComponent(
      HoverComponent.symbol
    ) as HoverComponent;

    const boxColliderComponent = entity.getComponent(
      physics.BoxColliderComponent.symbol
    ) as physics.BoxColliderComponent;

    const worldCoords = rendering.screenToWorldSpace(
      this._inputComponent.mouseCoordinates,
      this._cameraPosition,
      this._camera.zoom,
      this._worldSpace.center
    );

    if (
      !hoverComponent.isHovered &&
      boxColliderComponent.boundingBox.contains(worldCoords)
    ) {
      hoverComponent.isHovered = true;
      hoverComponent.onHoverStart(entity);
      return;
    }

    if (
      hoverComponent.isHovered &&
      !boxColliderComponent.boundingBox.contains(worldCoords)
    ) {
      hoverComponent.isHovered = false;
      hoverComponent.onHoverEnd(entity);
      return;
    }
  }
}
