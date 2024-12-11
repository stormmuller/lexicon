import { BoundingBox, Vector2 } from '../../math';
import { RenderLayer } from '../render-layer';
import { RenderEffects, RenderSource } from './render-source';

export class RoundedRectangleRenderSource implements RenderSource {
  width: number;
  height: number;
  radius: number;
  color: string;
  boundingBox: BoundingBox;
  renderEffects: RenderEffects;

  constructor(
    width: number,
    height: number,
    radius: number,
    color: string = 'black',
    renderEffects: RenderEffects = {},
  ) {
    this.width = width;
    this.height = height;
    this.radius = radius;
    this.color = color;
    this.boundingBox = new BoundingBox(
      new Vector2(0, 0),
      new Vector2(this.width, this.height),
    );
    this.renderEffects = renderEffects
  }

  render(layer: RenderLayer): void {
    const ctx = layer.context;

    ctx.beginPath();
    ctx.moveTo(this.radius, 0);

    // Top edge
    ctx.lineTo(this.width - this.radius, 0);
    ctx.arcTo(this.width, 0, this.width, this.radius, this.radius);

    // Right edge
    ctx.lineTo(this.width, this.height - this.radius);
    ctx.arcTo(
      this.width,
      this.height,
      this.width - this.radius,
      this.height,
      this.radius,
    );

    // Bottom edge
    ctx.lineTo(this.radius, this.height);
    ctx.arcTo(0, this.height, 0, this.height - this.radius, this.radius);

    // Left edge
    ctx.lineTo(0, this.radius);
    ctx.arcTo(0, 0, this.radius, 0, this.radius);

    ctx.closePath();

    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
