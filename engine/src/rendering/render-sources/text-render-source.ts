import { BoundingBox, Vector2 } from '../../math';
import { RenderLayer } from '../render-layer';
import { RenderEffects, RenderSource } from './render-source';

export class TextRenderSource implements RenderSource {
  text: string;
  fontFamily: string;
  color: string;
  boundingBox: BoundingBox;
  fontSize: number;
  offset: Vector2;
  renderEffects: RenderEffects;

  constructor(
    text: string,
    fontFamily: string = 'Arial',
    fontSize: number = 16,
    color: string = 'black',
    offset: Vector2 = Vector2.zero(),
    renderEffects: RenderEffects = {}
  ) {
    this.text = text;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.color = color;
    this.boundingBox = new BoundingBox(Vector2.zero(), Vector2.zero()); // gets updated in the render function as text can change at runtime
    this.offset = offset;
    this.renderEffects = renderEffects
  }

  render(layer: RenderLayer): void {
    const context = layer.context;

    context.font = `${this.fontSize}px ${this.fontFamily}`;

    const metrics = context.measureText(this.text);
    const width = metrics.width;
    const height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    this.boundingBox.dimentions = new Vector2(width, height);

    context.fillStyle = this.color;
    context.fillText(
      this.text,
      -(width / 2) + this.offset.x,
      height / 2 + this.offset.y,
    );
  }
}
