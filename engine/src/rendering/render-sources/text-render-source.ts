import { RenderLayer } from '../render-layer';
import { RenderSource } from './render-source';

export class TextRenderSource implements RenderSource {
  text: string;
  fontFamily: string;
  color: string;
  width: number;
  height: number;
  fontSize: number;

  constructor(
    text: string,
    fontFamily: string = 'Arial',
    fontSize: number = 16,
    color: string = 'black',
  ) {
    this.text = text;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.color = color;
    this.width = 0; // Calculated dynamically
    this.height = 0; // Calculated dynamically
  }

  render(layer: RenderLayer): void {
    const context = layer.context;

    context.font = `${this.fontSize}px ${this.fontFamily}`;

    // TODO: performace - cache calculated dimentions?
    const metrics = context.measureText(this.text);
    this.width = metrics.width;
    this.height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    context.fillStyle = this.color;
    context.fillText(this.text, -(this.width / 2), this.height / 2);
  }
}
