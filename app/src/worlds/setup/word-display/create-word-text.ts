import { common, ecs, math, rendering } from "@gameup/engine";
import { WordComponent, WordDisplaySystem } from "../../../word";
import { styles } from "../../../styles";

const fontSize = 60;

export function createWordText(
  world: ecs.World,
  renderLayer: rendering.RenderLayer
) {
  const textRenderSource = new rendering.TextRenderSource(
    "",
    styles.wordHistoryPanel.width,
    styles.wordHistoryPanel.width,
    "Share Tech Mono",
    60,
    "white"
  );

  const spriteComponent = new rendering.SpriteComponent(
    textRenderSource,
    renderLayer.name,
    { anchor: math.Vector2.zero() }    
  );
  const wordComponent = new WordComponent();
  const positionComponent = new common.PositionComponent(
    window.innerWidth / 2,
    styles.wordHistoryPanel.margin + styles.wordHistoryPanel.height / 2
  );
  const scaleComponent = new common.ScaleComponent();

  const entity = new ecs.Entity("word display", [
    positionComponent,
    scaleComponent,
    spriteComponent,
    wordComponent
  ]);

  const wordDisplaySystem = new WordDisplaySystem();

  world.addEntity(entity);
  world.addSystem(wordDisplaySystem);

  return entity;
}
