import { common, ecs, math } from "@gameup/engine";
import { ChainableComponent } from "./chainable-component";

export type OnChainCompleteCallback = (
  chainComponent: ChainComponent
) => common.SyncOrAsync<void>;
export type OnRemovedFromChainCallback = (
  linkRemoved: ecs.Entity,
  chainComponent: ChainComponent
) => common.SyncOrAsync<void>;
export type OnAddedToChainCallback = (
  linkAdded: ecs.Entity,
  chainComponent: ChainComponent
) => common.SyncOrAsync<void>;

export class ChainComponent implements ecs.Component {
  name: symbol;
  public path: Array<math.Vector2>;
  public links: Array<ecs.Entity>;
  private _onChainCompleteCallback: OnChainCompleteCallback;
  private _onRemovedFromChain: OnRemovedFromChainCallback;
  private _onAddedToChain: OnAddedToChainCallback;

  static symbol = Symbol("Chain");

  constructor(
    onChainCompleteCallback: OnChainCompleteCallback,
    onRemovedFromChain: OnRemovedFromChainCallback,
    onAddedToChain: OnAddedToChainCallback
  ) {
    this.name = ChainComponent.symbol;
    this.path = new Array();
    this.links = new Array();
    this._onChainCompleteCallback = onChainCompleteCallback;
    this._onRemovedFromChain = onRemovedFromChain;
    this._onAddedToChain = onAddedToChain;
  }

  public isEmpty(): boolean {
    return this.links.length === 0;
  }

  public async addLink(entity: ecs.Entity) {
    const chainableComponent = entity.getComponentRequired<ChainableComponent>(
      ChainableComponent.symbol
    );

    const postitionComponent =
      entity.getComponentRequired<common.PositionComponent>(
        common.PositionComponent.symbol
      );

    chainableComponent.chain = this;

    this.links.push(entity);
    this.path.push(postitionComponent);

    await this._onAddedToChain(entity, this);
  }

  public getTailLink(): common.OrNull<ecs.Entity> {
    return this.isEmpty() ? null : this.links[this.links.length - 1];
  }

  public getSecondLastLink(): ecs.Entity {
    return this.links[this.links.length - 2];
  }

  public async removeTail(): Promise<common.OrNull<ecs.Entity>> {
    const removedLink = this.links.pop() ?? null;

    this.path.pop();

    if (!common.isNil(removedLink)) {
      this._clearChainFromLink(removedLink!);
      await this._onRemovedFromChain(removedLink!, this);
    }

    return removedLink;
  }

  public containsLink(link: ecs.Entity): boolean {
    return !common.isNil(
      this.links.find((linkInChain) => linkInChain === link)
    );
  }

  public async complete(): Promise<void> {
    await this._onChainCompleteCallback(this);
  }

  public clearChain() {
    for (const link of this.links) {
      this._clearChainFromLink(link);
    }

    this.links.length = 0;
    this.path.length = 0;
  }

  private _clearChainFromLink(link: ecs.Entity) {
    const chainableComponent = link.getComponentRequired<ChainableComponent>(
      ChainableComponent.symbol
    );

    chainableComponent.chain = null;
  }
}
