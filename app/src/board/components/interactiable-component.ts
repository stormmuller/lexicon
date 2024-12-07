import { ecs } from "@gameup/engine";

export enum InteratiableState {
  none,
  hovered,
  selected,
}

export type OnInteractionCallback = (entity: ecs.Entity) => void;

export class InteractiableComponent implements ecs.Component {
  name: symbol;
  state: InteratiableState;
  onHoverStart: OnInteractionCallback;
  onHoverEnd: OnInteractionCallback;

  static symbol = Symbol("Interactiable");

  constructor(
    onHoverStart: OnInteractionCallback,
    onHoverEnd: OnInteractionCallback
  ) {
    this.name = InteractiableComponent.symbol;
    this.state = InteratiableState.none;
    this.onHoverStart = onHoverStart;
    this.onHoverEnd = onHoverEnd;
  }
}
