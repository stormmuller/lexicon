import { ecs } from "@gameup/engine";

export class ScoreComponent implements ecs.Component {
  name: symbol;
  score: number;

  static symbol = Symbol("Score");

  constructor(score: number = 0) {
    this.name = ScoreComponent.symbol;
    this.score = score;
  }
}
