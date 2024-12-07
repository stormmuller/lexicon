import { Component } from '../../ecs';

export class InputsComponent implements Component {
  name: symbol;

  scrollDelta: number = 0;
  keyPresses = new Set<string>();
  keyDowns = new Set<string>();
  keyUps = new Set<string>();

  static symbol = Symbol('Inputs');

  constructor() {
    this.name = InputsComponent.symbol;
  }

  keyPressed = (code: string) => {
    return this.keyPresses.has(code);
  };

  keyPressedDown = (code: string) => {
    return this.keyDowns.has(code);
  };

  keyPressedUp = (code: string) => {
    return this.keyUps.has(code);
  };
}
