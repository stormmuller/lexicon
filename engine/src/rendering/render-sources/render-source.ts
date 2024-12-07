import { RenderLayer } from '../render-layer';

export interface RenderSource {
  render(layer: RenderLayer): void;
  width: number;
  height: number;
}
