import { animations, common, ecs, math, rendering } from "@gameup/engine";
import { WordComponent, WordDisplaySystem } from "../../../word";
import { styles } from "../../../styles";

export function createWordText(
  world: ecs.World,
  renderLayer: rendering.RenderLayer
) {
const textRenderSource = new rendering.TextRenderSource(
    "",
    styles.wordDisplayPanel.width,
    styles.wordDisplayPanel.width,
    "Share Tech Mono",
    styles.wordDisplayPanel.fontSize,
    "white",
    "center",
    "middle",
    { glow: { color: "rgba(0,0,0,0.6)", radius: 4 } }
  );

  const spriteComponent = new rendering.SpriteComponent(
    textRenderSource,
    renderLayer.name,
    { anchor: math.Vector2.zero() }
  );
  const wordComponent = new WordComponent();
  const positionComponent = new common.PositionComponent(
    styles.wordDisplayPanel.position.x,
    styles.wordDisplayPanel.position.y
  );
  const scaleComponent = new common.ScaleComponent();
  const animationComponent = new animations.AnimationComponent();

  const entity = new ecs.Entity("word display", [
    positionComponent,
    scaleComponent,
    spriteComponent,
    wordComponent,
    animationComponent,
  ]);

  const wordDisplaySystem = new WordDisplaySystem();

  world.addEntity(entity);
  world.addSystem(wordDisplaySystem);

  return entity;
}
