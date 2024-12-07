import { Component } from '../../ecs';

export class RotationComponent implements Component {
  name: symbol;
  radians: number;

  static symbol = Symbol('Rotation');

  constructor(degrees: number) {
    this.name = RotationComponent.symbol;
    this.radians = (degrees * Math.PI) / 180;
  }
}
