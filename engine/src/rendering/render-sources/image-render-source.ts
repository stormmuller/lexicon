import { ImageCache } from '../asset-caches';
import { RenderLayer } from '../render-layer';
import { RenderSource } from './render-source';

export class ImageRenderSource implements RenderSource {
  image: HTMLImageElement;
  width: number;
  height: number;
  bleed: number;

  constructor(image: HTMLImageElement, bleed: number = 1) {
    this.image = image;
    this.width = image.width;
    this.height = image.height;
    this.bleed = bleed;
  }

  render(layer: RenderLayer): void {
    layer.context.drawImage(
      this.image,
      0,
      0,
      this.width + this.bleed,
      this.height + this.bleed,
    );
  }

  public static async fromImageCache(imageCache: ImageCache, path: string, bleed: number = 1) {
    const image = await imageCache.getOrLoad(path);
    return new ImageRenderSource(image, bleed);
  }
}
