import { Entity, System } from '../../ecs';
import { InputsComponent } from '../components';

export class InputSystem extends System {
  private _scrollDelta: number = 0;
  private _keyPresses = new Set<string>();
  private _keyUps = new Set<string>();
  private _keyDowns = new Set<string>();
  private _gameContainer: HTMLElement;

  constructor(gameContainer: HTMLElement) {
    super('input', [InputsComponent.symbol]);

    this._gameContainer = gameContainer;

    gameContainer.addEventListener('wheel', this.onWheelEventHandler);
    document.addEventListener('keydown', this.onKeyDownHandler);
    document.addEventListener('keyup', this.onKeyUpHandler);
  }

  async run(entity: Entity): Promise<void> {
    const inputs = entity.getComponent(
      InputsComponent.symbol,
    ) as InputsComponent; // TODO: feature - Make singleton components?

    inputs.keyPresses = this._keyPresses;
    inputs.keyUps = this._keyUps;
    inputs.keyDowns = this._keyDowns;
    inputs.scrollDelta = this._scrollDelta;
    this.clearInputs();
  }

  shutdown(): void {
    this._gameContainer.removeEventListener('wheel', this.onWheelEventHandler);
    document.removeEventListener('keydown', this.onKeyDownHandler);
    document.removeEventListener('keyup', this.onKeyUpHandler);
  }

  clearInputs = () => {
    this._scrollDelta = 0;
    this._keyDowns.clear();
    this._keyUps.clear();
  };

  onWheelEventHandler = (event: WheelEvent) => {
    this._scrollDelta = event.deltaY;
    event.preventDefault();
  };

  onKeyUpHandler = (event: KeyboardEvent) => {
    this._keyPresses.delete(event.code);
    this._keyUps.add(event.code);
  };

  onKeyDownHandler = (event: KeyboardEvent) => {
    if (event.repeat) {
      return;
    }

    this._keyPresses.add(event.code);
    this._keyDowns.add(event.code);
  };
}
