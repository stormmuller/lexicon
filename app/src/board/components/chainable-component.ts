import { ecs } from "@gameup/engine";
import { OnInteractionCallback } from "../types";

export class ChainableComponent implements ecs.Component {
  name: symbol;
  isPartOfChain: boolean;
  onAddedToChain: OnInteractionCallback;
  onRemovedFromChain: OnInteractionCallback;

  static symbol = Symbol("Chainable");

  constructor(
    onAddedToChain: OnInteractionCallback,
    onRemovedFromChain: OnInteractionCallback
  ) {
    this.name = ChainableComponent.symbol;
    this.isPartOfChain = false;
    this.onAddedToChain = onAddedToChain;
    this.onRemovedFromChain = onRemovedFromChain;
  }
}
