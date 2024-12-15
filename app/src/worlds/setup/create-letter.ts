import { common, ecs, math, rendering } from "@gameup/engine";
import { styles } from "../../styles";

export async function createLetter(
  layer: rendering.RenderLayer,
  world: ecs.World,
  x: number,
  y: number,
  text: string,
  fontSize: number,
  name: string,
  fontColor: string = "white",
  fontFamily: string = "Share Tech Mono"
) {
  await document.fonts.ready;

  const textRenderSource = new rendering.TextRenderSource(
    text,
    styles.tile.size,
    styles.tile.size,
    fontFamily,
    fontSize,
    fontColor,
    "center"
  );

  const entity = new ecs.Entity(name, [
    new common.PositionComponent(x, y),
    new common.RotationComponent(0),
    new rendering.SpriteComponent(textRenderSource, layer.name, {
      anchor: math.Vector2.zero()
    })
  ]);

  world.addEntity(entity);
}
