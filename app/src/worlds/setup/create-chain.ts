import { common, ecs, rendering } from "@gameup/engine";
import { TileComponent } from "../../tile";
import { ChainComponent, ChainSystem } from "../../chain";

export function createChain(
  world: ecs.World,
  inputsEntity: ecs.Entity,
  worldCamera: ecs.Entity,
  worldSpace: common.Space,
  tileChainImageRenderSource: rendering.RenderSource,
  tileImageRenderSource: rendering.RenderSource,
  focusedRenderLayer: rendering.RenderLayer,
  normalRenderLayer: rendering.RenderLayer
) {
  async function chainComplete(links: Array<ecs.Entity>) {
    let word = "";

    for (const link of links) {
      const tileComponent = link.getComponent(
        TileComponent.symbol
      ) as TileComponent;

      word += tileComponent.letter;
    }

    const api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    const response = await fetch(api);
    console.log(await response.json());
  }

  function onAddedToChain(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = tileChainImageRenderSource;
    sprite.renderLayerName = focusedRenderLayer.name;
  }

  function onRemovedFromChain(entity: ecs.Entity) {
    const sprite = entity.getComponent(
      rendering.SpriteComponent.symbol
    ) as rendering.SpriteComponent;

    sprite.renderSource = tileImageRenderSource;
    sprite.renderLayerName = normalRenderLayer.name;
  }

  const chain = new ecs.Entity("chain", [
    new ChainComponent(chainComplete, onRemovedFromChain, onAddedToChain),
  ]);

  world.addEntity(chain);

  const chainSystem = new ChainSystem(
    inputsEntity,
    worldCamera,
    worldSpace,
    chain
  );

  world.addSystem(chainSystem);

  return chain;
}
