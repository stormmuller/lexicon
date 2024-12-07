import { common, ecs, type game, rendering } from '@gameup/engine';

export class WindowResizer implements common.Stoppable {
  private _world: ecs.World;
  private _game: game.Game;
  private _worldSpace: common.Space;
  private _layers: rendering.RenderLayer[];

  constructor(
    world: ecs.World,
    game: game.Game,
    worldSpace: common.Space,
    layers: rendering.RenderLayer[],
  ) {
    this._world = world;
    this._game = game;
    this._worldSpace = worldSpace;
    this._layers = layers;

    this._game.onWindowResize.registerListener(this._windowResizeListener);
  }

  private _windowResizeListener = async () => {
    this._worldSpace.setValue(window.innerWidth, window.innerHeight);

    const cameras = ecs.filterEntitiesByComponents(this._world.entities, [
      rendering.CameraComponent.symbol,
      common.PositionComponent.symbol,
    ]);

    for (const camera of cameras) {
      const cameraPosition = camera.getComponent(
        common.PositionComponent.symbol,
      ) as common.PositionComponent;

      cameraPosition.x = -this._worldSpace.center.x / 2;
      cameraPosition.y = -this._worldSpace.center.y / 2;
    }

    for (const layer of this._layers) {
      layer.resize();
    }
  };

  stop() {
    this._game.onWindowResize.deregisterListener(this._windowResizeListener);
  }
}
