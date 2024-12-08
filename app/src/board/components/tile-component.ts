import { ecs } from "@gameup/engine";

export class TileComponent implements ecs.Component {
  name: symbol;
  letter: string;
  x: number;
  y: number;

  static symbol = Symbol("Tile");

  constructor(letter: string, x: number, y: number) {
    this.name = TileComponent.symbol;
    this.letter = letter;
    this.x = x;
    this.y = y;
  }
}
