import { ecs } from "@gameup/engine";
import { OnInteractionCallback } from "../types";

export class HoverComponent implements ecs.Component {
  name: symbol;
  isHovered: boolean;
  onHoverStart: OnInteractionCallback;
  onHoverEnd: OnInteractionCallback;

  static symbol = Symbol("Interactiable");

  constructor(
    onHoverStart: OnInteractionCallback,
    onHoverEnd: OnInteractionCallback
  ) {
    this.name = HoverComponent.symbol;
    this.isHovered = false;
    this.onHoverStart = onHoverStart;
    this.onHoverEnd = onHoverEnd;
  }
}
