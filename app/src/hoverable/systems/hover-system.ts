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

    this._inputComponent =
      inputEntity.getComponentRequired<input.InputsComponent>(
        input.InputsComponent.symbol
      );

    this._camera = cameraEntity.getComponentRequired<rendering.CameraComponent>(
      rendering.CameraComponent.symbol
    );
    this._cameraPosition =
      cameraEntity.getComponentRequired<common.PositionComponent>(
        common.PositionComponent.symbol
      );
    this._worldSpace = worldSpace;
  }

  async run(entity: ecs.Entity): Promise<void> {
    const hoverComponent = entity.getComponentRequired<HoverComponent>(
      HoverComponent.symbol
    );

    const boxColliderComponent =
      entity.getComponentRequired<physics.BoxColliderComponent>(
        physics.BoxColliderComponent.symbol
      );

    const worldCoords = rendering.screenToWorldSpace(
      this._inputComponent.mouseCoordinates,
      this._cameraPosition,
      this._camera.zoom,
      this._worldSpace.center
    );

    const mouseIsInBoundingBox =
      boxColliderComponent.boundingBox.contains(worldCoords);

    if (!hoverComponent.isHovered && mouseIsInBoundingBox) {
      hoverComponent.isHovered = true;
      hoverComponent.onHoverStart(entity);
      return;
    }

    if (hoverComponent.isHovered && !mouseIsInBoundingBox) {
      hoverComponent.isHovered = false;
      hoverComponent.onHoverEnd(entity);
      return;
    }
  }
}
