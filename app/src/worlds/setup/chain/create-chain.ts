import { common, ecs, rendering } from "@gameup/engine";
import { ChainComponent, ChainSystem } from "../../../chain";
import { styles } from "../../../styles";
import {
  onAddedToChain,
  onChainComplete,
  onRemovedFromChain,
} from "./chain-events";
import { WordComponent } from "../../../word";

export function createChain(
  world: ecs.World,
  inputsEntity: ecs.Entity,
  worldCamera: ecs.Entity,
  worldSpace: common.Space,
  tileChainImageRenderSource: rendering.RenderSource,
  tileImageRenderSource: rendering.RenderSource,
  focusedRenderLayer: rendering.RenderLayer,
  normalRenderLayer: rendering.RenderLayer,
  wordComponent: WordComponent
) {
  const chainComponent = new ChainComponent(
    onChainComplete({
      renderSource: tileImageRenderSource,
      renderLayer: normalRenderLayer,
      wordComponent
    }),
    onRemovedFromChain({
      renderSource: tileImageRenderSource,
      renderLayer: normalRenderLayer,
      wordComponent
    }),
    onAddedToChain({
      renderSource: tileChainImageRenderSource,
      renderLayer: focusedRenderLayer,
      wordComponent
    })
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
    normalRenderLayer.name
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
