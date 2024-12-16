import { ecs } from "@gameup/engine";
import { OnInteractionCallback } from "../../types";

export class LeaderboardComponent implements ecs.Component {
  name: symbol;
  isHovered: boolean;
  onHoverStart: OnInteractionCallback;
  onHoverEnd: OnInteractionCallback;

  static symbol = Symbol("Leaderboard");

  constructor(
    onHoverStart: OnInteractionCallback,
    onHoverEnd: OnInteractionCallback
  ) {
    this.name = LeaderboardComponent.symbol;
    this.isHovered = false;
    this.onHoverStart = onHoverStart;
    this.onHoverEnd = onHoverEnd;
  }
}
