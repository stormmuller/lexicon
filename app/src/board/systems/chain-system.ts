import { common, ecs, input, physics, rendering } from "@gameup/engine";
import {
  ChainableComponent,
  ChainComponent,
  TileComponent,
} from "../components";

export class ChainSystem extends ecs.System {
  private _camera: rendering.CameraComponent;
  private _cameraPosition: common.PositionComponent;
  private _worldSpace: common.Space;
  private _inputComponent: input.InputsComponent;
  private _chain: ChainComponent;

  constructor(
    inputEntity: ecs.Entity,
    cameraEntity: ecs.Entity,
    worldSpace: common.Space,
    chain: ecs.Entity
  ) {
    super("chain", [
      ChainableComponent.symbol,
      TileComponent.symbol,
      physics.BoxColliderComponent.symbol,
    ]);

    this._inputComponent = inputEntity.getComponent(
      input.InputsComponent.symbol
    ) as input.InputsComponent;

    this._camera = cameraEntity.getComponent(
      rendering.CameraComponent.symbol
    ) as rendering.CameraComponent;

    this._cameraPosition = cameraEntity.getComponent(
      common.PositionComponent.symbol
    ) as common.PositionComponent;

    this._worldSpace = worldSpace;
    this._chain = chain.getComponent(ChainComponent.symbol) as ChainComponent;
  }

  async run(entity: ecs.Entity): Promise<void> {
    const boxColliderComponent = entity.getComponent(
      physics.BoxColliderComponent.symbol
    ) as physics.BoxColliderComponent;

    const tileComponent = entity.getComponent(
      TileComponent.symbol
    ) as TileComponent;

    const previousTileComponent = this._chain
      .getTailLink()
      ?.getComponent<TileComponent>(TileComponent.symbol);

    // Subtract the worldSpace center first
    let worldCoords = this._inputComponent.mouseCoordinates.subtract(
      this._worldSpace.center
    );

    // Now invert the scale
    worldCoords = worldCoords.divide(this._camera.zoom);

    // Now invert the camera translation
    worldCoords = worldCoords.add(this._cameraPosition);

    const mouseButtonPressed = this._inputComponent.isMouseButtonPressed(
      input.mouseButtons.left
    );

    const mouseIsInBoundingBox =
      boxColliderComponent.boundingBox.contains(worldCoords);

    const isAdditionToChain =
      mouseButtonPressed &&
      !this._chain.containsLink(entity) &&
      mouseIsInBoundingBox;

    if (isAdditionToChain) {
      if (
        this._chain.isEmpty() ||
        this._isAdjecentToLastLink(
          tileComponent,
          previousTileComponent as TileComponent
        )
      ) {
        this._chain.addLink(entity);
      }

      return;
    }

    const isBackTrack =
      mouseButtonPressed &&
      this._chain.containsLink(entity) &&
      entity === this._chain.getSecondLastLink() &&
      mouseIsInBoundingBox;

    if (isBackTrack) {
      await this._chain.removeTail();
    }

    const mouseButtonLifted = this._inputComponent.isMouseButtonUp(
      input.mouseButtons.left
    );

    if (mouseButtonLifted && !this._chain.isEmpty()) {
      await this._chain.complete();
    }
  }

  private _isAdjecentToLastLink(
    newTile: TileComponent,
    previousTile: TileComponent
  ): boolean {
    const dx = Math.abs(newTile.x - previousTile.x);
    const dy = Math.abs(newTile.y - previousTile.y);

    // Tiles are adjacent if dx <= 1 and dy <= 1, but not the same tile
    return dx <= 1 && dy <= 1 && !(dx === 0 && dy === 0);
  }
}
