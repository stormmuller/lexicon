import { Component } from '../../ecs';
import { Vector2 } from '../../math';

export class ScaleComponent extends Vector2 implements Component {
  name: symbol;

  static symbol = Symbol('Scale');

  constructor(x: number = 0, y: number = 0) {
    super(x, y);

    this.name = ScaleComponent.symbol;
  }
}
