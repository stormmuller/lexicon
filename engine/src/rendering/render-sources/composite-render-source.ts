import { RenderLayer } from '../render-layer';
import { RenderSource } from './render-source';

export type RenderSourceMap = {
  [key: string]: RenderSource;
};

export class CompositeRenderSource implements RenderSource {
  renderSources: RenderSourceMap;
  width: number;
  height: number;

  constructor(renderSources: RenderSourceMap) {
    this.renderSources = renderSources;
    
    this.width = this._calculateMaxWidth();
    this.height = this._calculateMaxHeight();
  }

  private _calculateMaxWidth() {
    let maxWidth = 0;

    for (const renderSourceName in this.renderSources) {
      const renderSource = this.renderSources[renderSourceName];

      if (renderSource.width > maxWidth) {
        maxWidth = renderSource.width;
      }
    }

    return maxWidth;
  }

  private _calculateMaxHeight() {
    let maxHeight = 0;

    for (const renderSourceName in this.renderSources) {
      const renderSource = this.renderSources[renderSourceName];

      if (renderSource.height > maxHeight) {
        maxHeight = renderSource.height;
      }
    }

    return maxHeight;
  }

  public getRenderSource<T>(key: string): T {
    return this.renderSources[key] as T;
  }

  public render(layer: RenderLayer): void {
    for (const renderSourceName in this.renderSources) {
      const renderSource = this.renderSources[renderSourceName];
      renderSource.render(layer);
    }
  }
}
