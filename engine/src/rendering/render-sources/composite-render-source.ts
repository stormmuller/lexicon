import { RenderLayer } from '../render-layer';
import { RenderSource } from './render-source';

export class CompositeRenderSource implements RenderSource {
  renderSources: RenderSource[];
  width: number;
  height: number;

  constructor(renderSources: RenderSource[]) {
    this.renderSources = renderSources;
    
    this.width = renderSources.reduce(
      (maxWidth, source) => Math.max(maxWidth, source.width),
      0
    );

    this.height = renderSources.reduce(
      (maxHeight, source) => Math.max(maxHeight, source.height),
      0
    );
  }

  render(layer: RenderLayer): void {
    for (const renderSource of this.renderSources) {
      renderSource.render(layer);
    }
  }
}
