import { BoundingBox, Vector2 } from '../../math';
import { RenderLayer } from '../render-layer';
import { RenderEffects, RenderSource } from './render-source';

export class TextRenderSource implements RenderSource {
  text: string;
  fontFamily: string;
  color: string;
  boundingBox: BoundingBox;
  fontSize: number;
  textAlign: CanvasTextAlign;
  textBaseline: CanvasTextBaseline;
  maxWidth?: number;
  renderEffects: RenderEffects;

  constructor(
    text: string,
    maxWidth: number,
    fontFamily: string = 'Arial',
    fontSize: number = 16,
    color: string = 'black',
    textAlign: CanvasTextAlign = 'center',
    textBaseline: CanvasTextBaseline = 'middle',
    renderEffects: RenderEffects = {},
  ) {
    this.text = text;
    this.fontFamily = fontFamily;
    this.fontSize = fontSize;
    this.color = color;
    this.textAlign = textAlign;
    this.textBaseline = textBaseline;
    this.maxWidth = maxWidth;
    this.renderEffects = renderEffects;

    const tempCanvas = document.createElement('canvas').getContext('2d')!;
    tempCanvas.font = `${this.fontSize}px ${this.fontFamily}`;
    const metrics = tempCanvas.measureText(this.text);
    const height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    this.boundingBox = new BoundingBox(
      Vector2.zero(),
      new Vector2(maxWidth, height),
    );
  }

  render(layer: RenderLayer): void {
    const context = layer.context;

    // Set font and alignment
    context.font = `${this.fontSize}px ${this.fontFamily}`;
    context.textAlign = this.textAlign;
    context.textBaseline = this.textBaseline;

    // Measure text and calculate dimensions
    let renderText = this.text;
    const metrics = context.measureText(this.text);
    let width = metrics.width;
    const height =
      metrics.actualBoundingBoxAscent + metrics.actualBoundingBoxDescent;

    // Handle maxWidth constraint
    if (this.maxWidth && width > this.maxWidth) {
      const ellipsis = '...';

      let truncatedText = '';
      for (let i = 0; i < this.text.length; i++) {
        const testText = this.text.substring(0, i + 1) + ellipsis;
        const testWidth = context.measureText(testText).width;

        if (testWidth <= this.maxWidth) {
          truncatedText = testText;
        } else {
          break;
        }
      }
      renderText = truncatedText;
          }

    // Update bounding box dimensions
    this.boundingBox.dimentions = new Vector2(this.maxWidth, height);

    // Apply fill style
    context.fillStyle = this.color;

    // If baseline is 'middle', adjust to visually center the text
    if (this.textBaseline === 'middle') {
      // Force a stable baseline for calculation
      context.textBaseline = 'alphabetic';
      const ascent = metrics.actualBoundingBoxAscent;
      const descent = metrics.actualBoundingBoxDescent;
      const verticalCenterOffset = (descent + ascent) / 2;
      context.fillText(renderText, 0, verticalCenterOffset);
    } else {
      // For other baselines, just draw the text at (0,0)
      context.fillText(renderText, 0, 0);
    }
  }
}
