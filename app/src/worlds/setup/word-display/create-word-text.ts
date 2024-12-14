import { common, ecs, rendering } from "@gameup/engine";
import { WordComponent, WordDisplaySystem } from "../../../word";
import { styles } from "../../../styles";

export function createWordText(
  world: ecs.World,
  renderLayer: rendering.RenderLayer
) {
  const textRenderSource = new rendering.TextRenderSource(
    "",
    styles.wordHistoryPanel.width,
    "Share Tech Mono",
    60,
    "white",
    "center",
  );

  const containerHeight = 100;
  const containerMargin = 20;

  const spriteComponent = new rendering.SpriteComponent(
    textRenderSource,
    renderLayer.name
  );
  const wordComponent = new WordComponent();
  const positionComponent = new common.PositionComponent(
    window.innerWidth / 2 + styles.wordHistoryPanel.width / 2,
    containerMargin + containerHeight / 2
  );
  const scaleComponent = new common.ScaleComponent();

  const entity = new ecs.Entity("word display", [
    positionComponent,
    scaleComponent,
    spriteComponent,
    wordComponent,
  ]);

  const wordDisplaySystem = new WordDisplaySystem();

  world.addEntity(entity);
  world.addSystem(wordDisplaySystem);

  return entity;
}
