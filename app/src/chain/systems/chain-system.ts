import { common, ecs, input, physics, rendering } from "@gameup/engine";
import { ChainableComponent, ChainComponent } from "../components";
import { TileComponent } from "../../tile";

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

    const lastLink = this._chain.getTailLink();
    const lastTileComponent = lastLink?.getComponent<TileComponent>(
      TileComponent.symbol
    );

    const mouseButtonPressed = this._inputComponent.isMouseButtonPressed(
      input.mouseButtons.left
    );

    const worldCoords = rendering.screenToWorldSpace(
      this._inputComponent.mouseCoordinates,
      this._cameraPosition,
      this._camera.zoom,
      this._worldSpace.center
    );

    const mouseIsInBoundingBox =
      boxColliderComponent.boundingBox.contains(worldCoords);

    const chainContainsEntity = this._chain.containsLink(entity);
    const entityIsPreviousLink = entity === this._chain.getSecondLastLink();

    const isAdditionToChain =
      mouseButtonPressed && !chainContainsEntity && mouseIsInBoundingBox;

    const isValidAdditionToChain = this._isValidAddition(
      tileComponent,
      lastTileComponent
    );

    if (isAdditionToChain && isValidAdditionToChain) {
      this._chain.addLink(entity);

      return;
    }

    const isBackTrack =
      mouseButtonPressed && entityIsPreviousLink && mouseIsInBoundingBox;

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

  private _isValidAddition(
    tileComponent: TileComponent,
    lastTileComponent: common.OrNull<TileComponent> | undefined
  ): boolean {
    return (
      this._chain.isEmpty() ||
      this._isAdjecentToLastLink(
        tileComponent,
        lastTileComponent as TileComponent
      )
    );
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
