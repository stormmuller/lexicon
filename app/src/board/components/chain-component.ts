import { common, ecs } from "@gameup/engine";
import { ChainableComponent } from "./chainable-component";

type OnChainCompleteCallback = (links: Array<ecs.Entity>) => common.SyncOrAsync<void>;
type OnRemovedFromChain = (entity: ecs.Entity) => common.SyncOrAsync<void>;
type OnAddedToChain = (entity: ecs.Entity) => common.SyncOrAsync<void>;

export class ChainComponent implements ecs.Component {
  name: symbol;
  private _links: Array<ecs.Entity>;
  private _onChainCompleteCallback: OnChainCompleteCallback;
  private _onRemovedFromChain: OnRemovedFromChain;
  private _onAddedToChain: OnAddedToChain;

  static symbol = Symbol("Chain");

  constructor(
    onChainCompleteCallback: OnChainCompleteCallback,
    onRemovedFromChain: OnRemovedFromChain,
    onAddedToChain: OnAddedToChain
  ) {
    this.name = ChainComponent.symbol;
    this._links = new Array();
    this._onChainCompleteCallback = onChainCompleteCallback;
    this._onRemovedFromChain = onRemovedFromChain;
    this._onAddedToChain = onAddedToChain;
  }

  public isEmpty(): boolean {
    return this._links.length === 0;
  }

  public async addLink(entity: ecs.Entity) {
    const chainableComponent = entity.getComponent(
      ChainableComponent.symbol
    ) as ChainableComponent;

    chainableComponent.chain = this;

    await this._onAddedToChain(entity);
    this._links.push(entity);
  }

  public getTailLink(): common.OrNull<ecs.Entity> {
    return this.isEmpty() ? null : this._links[this._links.length - 1];
  }

  public getSecondLastLink(): ecs.Entity {
    return this._links[this._links.length - 2];
  }

  public async removeTail(): Promise<common.OrNull<ecs.Entity>> {
    const removedLink = this._links.pop() ?? null;

    if (!common.isNil(removedLink)) {
      this._clearChainFromLink(removedLink as ecs.Entity)
      await this._onRemovedFromChain(removedLink as ecs.Entity);
    }

    return removedLink;
  }

  public containsLink(link: ecs.Entity): boolean {
    return !common.isNil(
      this._links.find((linkInChain) => linkInChain === link)
    );
  }

  public async complete(): Promise<void> {
    await this._onChainCompleteCallback(this._links);

    for (const link of this._links) {
      this._clearChainFromLink(link)
    }

    this._links = new Array();
  }

  private _clearChainFromLink(link: ecs.Entity) {
    const chainableComponent = link.getComponent(
      ChainableComponent.symbol
    ) as ChainableComponent;

    chainableComponent.chain = null;
  }
}
