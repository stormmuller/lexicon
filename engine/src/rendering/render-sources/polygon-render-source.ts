import { Path } from '../../common';
import { BoundingBox, calculateBoundingBox } from '../../math';
import { RenderLayer } from '../render-layer';
import { RenderSource } from './render-source';

export class PolygonRenderSource implements RenderSource {
  path: Path;
  color: string;
  width: number;
  height: number;
  boundingBox: BoundingBox;

  constructor(path: Path, color: string = 'black') {
    this.path = path;
    this.color = color;
    this.boundingBox = calculateBoundingBox(path);
    this.width = this.boundingBox.dimentions.x;
    this.height = this.boundingBox.dimentions.y;
  }

  render(layer: RenderLayer): void {
    layer.context.beginPath();

    for (let i = 0; i < this.path.length; i++) {
      const point = this.path.at(i);

      if (i === 0) {
        layer.context.moveTo(point.x, point.y);
      } else {
        layer.context.lineTo(point.x, point.y);
      }
    }

    layer.context.fillStyle = this.color;
    layer.context.fill();
  }
}