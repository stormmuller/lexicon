import { BoundingBox } from '../../math';
import { RenderLayer } from '../render-layer';

export type GlowEffect = {
  color: string;
  radius: number;
};

export type RenderEffects = {
  glow?: GlowEffect;
};

export interface RenderSource {
  render(layer: RenderLayer): void;
  boundingBox: BoundingBox;
  renderEffects: RenderEffects;
}
