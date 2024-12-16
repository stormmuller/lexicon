import { common, ecs, type game, rendering } from "@gameup/engine";

export class WindowResizer implements common.Stoppable {
  private _world: ecs.World;
  private _game: game.Game;
  private _layers: rendering.RenderLayer[];

  constructor(
    world: ecs.World,
    game: game.Game,
    layers: rendering.RenderLayer[]
  ) {
    this._world = world;
    this._game = game;
    this._layers = layers;

    this._game.onWindowResize.registerListener(this._windowResizeListener);
  }

  private _windowResizeListener = async () => {
    const cameras = ecs.filterEntitiesByComponents(this._world.entities, [
      rendering.CameraComponent.symbol,
      common.PositionComponent.symbol,
    ]);

    const cameraPositions = [];

    for (let i = 0; i < cameras.length; i++) {
      const camera = cameras[i];

      const cameraPosition =
        camera.getComponentRequired<common.PositionComponent>(
          common.PositionComponent.symbol
        );

      cameraPositions[i] = {
        x: cameraPosition.x / window.innerWidth,
        y: cameraPosition.y / window.innerHeight,
      };
    }

    for (let i = 0; i < cameras.length; i++) {
      const camera = cameras[i];

      const cameraPosition =
        camera.getComponentRequired<common.PositionComponent>(
          common.PositionComponent.symbol
        );

      cameraPosition.x = cameraPositions[i].x * window.innerWidth;
      cameraPosition.y = cameraPositions[i].y * window.innerHeight;
    }

    for (const layer of this._layers) {
      console.log(`Resizing layer ${layer.name}`);
      layer.resize();
    }
  };

  stop() {
    this._game.onWindowResize.deregisterListener(this._windowResizeListener);
  }
}
