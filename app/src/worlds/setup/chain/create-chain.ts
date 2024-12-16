import { common, ecs, rendering } from "@gameup/engine";
import {
  ChainComponent,
  ChainSystem,
  OnAddedToChainCallback,
  OnChainCompleteCallback,
  OnRemovedFromChainCallback,
} from "../../../chain";
import { styles } from "../../../styles";

export function createChain(
  world: ecs.World,
  inputsEntity: ecs.Entity,
  worldCamera: ecs.Entity,
  worldSpace: common.Space,
  normalRenderLayer: rendering.RenderLayer,
  onChainComplete: OnChainCompleteCallback,
  onRemovedFromChain: OnRemovedFromChainCallback,
  onAddedToChain: OnAddedToChainCallback
) {
  const chainComponent = new ChainComponent(
    onChainComplete,
    onRemovedFromChain,
    onAddedToChain
  );

  const lineRenderSource = new rendering.LineRenderSource(
    chainComponent.path,
    styles.line.cornderRadius,
    styles.line.color,
    styles.line.thinkness
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
