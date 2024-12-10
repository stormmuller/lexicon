import { common, ecs } from "@gameup/engine";
import { ChainComponent } from "./chain-component";

export class ChainableComponent implements ecs.Component {
  name: symbol;
  chain: common.OrNull<ChainComponent>;

  static symbol = Symbol("Chainable");

  constructor() {
    this.name = ChainableComponent.symbol;
    this.chain = null;
  }
}
