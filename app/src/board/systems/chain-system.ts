import { common, ecs, input, physics, rendering } from "@gameup/engine";
import { ChainableComponent, TileComponent } from "../components";

export class ChainSystem extends ecs.System {
  private _camera: rendering.CameraComponent;
  private _cameraPosition: common.PositionComponent;
  private _worldSpace: common.Space;
  private _inputComponent: input.InputsComponent;
  private _chain = new Array<ecs.Entity>();

  constructor(
    inputEntity: ecs.Entity,
    cameraEntity: ecs.Entity,
    worldSpace: common.Space
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
  }

  async run(entity: ecs.Entity): Promise<void> {
    const chainableComponent = entity.getComponent(
      ChainableComponent.symbol
    ) as ChainableComponent;

    const boxColliderComponent = entity.getComponent(
      physics.BoxColliderComponent.symbol
    ) as physics.BoxColliderComponent;

    const tileComponent = entity.getComponent(
      TileComponent.symbol
    ) as TileComponent;

    const isFirstLinkInChain = this._chain.length === 0;

    const previousTileEntity = isFirstLinkInChain
      ? null
      : this._chain[this._chain.length - 1];

    const previousTileComponent =
      previousTileEntity?.getComponent<TileComponent>(TileComponent.symbol);

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
      !chainableComponent.isPartOfChain &&
      mouseIsInBoundingBox;

    if (isAdditionToChain) {
      if (
        isFirstLinkInChain ||
        this._isAdjecentToLastLink(
          tileComponent,
          previousTileComponent as TileComponent
        )
      ) {
        this._chain.push(entity);
        chainableComponent.isPartOfChain = true;
        chainableComponent.onAddedToChain(entity);
      }
      
      return;
    }

    const secondLastLink = this._chain[this._chain.length - 2];

    const isBackTrack =
      mouseButtonPressed &&
      chainableComponent.isPartOfChain &&
      entity === secondLastLink &&
      mouseIsInBoundingBox;

    if (isBackTrack) {
      const lastLink = this._chain.pop();

      if (!lastLink) {
        return;
      }

      const lastLinkChainableComponent = lastLink.getComponent(
        ChainableComponent.symbol
      ) as ChainableComponent;
      const tileComponent = lastLink.getComponent(
        TileComponent.symbol
      ) as TileComponent;

      console.log(`Removed ${tileComponent.letter} from the chain`);

      lastLinkChainableComponent.isPartOfChain = false;
      lastLinkChainableComponent.onRemovedFromChain(lastLink);

      return;
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
