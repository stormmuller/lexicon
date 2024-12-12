import { common, ecs, rendering } from "@gameup/engine";
import { TileComponent } from "../../tile";
import { ChainComponent, ChainSystem } from "../../chain";
import { styles } from "../../styles";

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
  async function onChainComplete(links: Array<ecs.Entity>) {
    let word = "";

    for (const link of links) {
      const tileComponent = link.getComponent(
        TileComponent.symbol
      ) as TileComponent;

      word += tileComponent.letter;
    }

    window.parent.postMessage({
      type: 'chain-complete',
      data: { word }
    }, '*');

    console.log(`posting message "${word}"`);

    // const api = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;
    // const response = await fetch(api);
    // console.log(await response.json());
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

  const chainComponent = new ChainComponent(
    onChainComplete,
    onRemovedFromChain,
    onAddedToChain
  );

  const lineRenderSource = new rendering.LineRenderSource(
    chainComponent.path,
    styles.line.cornderRadius,
    styles.line.color,
    styles.line.thinkness,
    {
      glow: styles.line.glow,
    }
  );

  const chainSprite = new rendering.SpriteComponent(
    lineRenderSource,
    focusedRenderLayer.name
  );

  const chainPosition = new common.PositionComponent();
  const chainScale = new common.ScaleComponent();

  const chain = new ecs.Entity("chain", [
    chainPosition,
    chainScale,
    chainComponent,
    chainSprite,
  ]);

  world.addEntities([chain]);

  const chainSystem = new ChainSystem(
    inputsEntity,
    worldCamera,
    worldSpace,
    chain
  );

  world.addSystem(chainSystem);

  return chain;
}
