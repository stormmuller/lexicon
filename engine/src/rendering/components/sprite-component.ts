import { Component } from '../../ecs';
import { Vector2 } from '../../math';
import { RenderSource } from '../render-sources/render-source';

export class SpriteComponent implements Component {
  name: symbol;
  renderSource: RenderSource;
  anchor: Vector2;
  debugMode: boolean;
  renderLayerName: string;

  static symbol = Symbol('Sprite');

  constructor(
    renderSource: RenderSource,
    renderLayerName: string,
    anchor: Vector2 = new Vector2(
      renderSource.boundingBox.dimentions.x / 2,
      renderSource.boundingBox.dimentions.y / 2,
    ),
    debugMode: boolean = false,
  ) {
    this.name = SpriteComponent.symbol;
    this.renderSource = renderSource;
    this.anchor = anchor;
    this.debugMode = debugMode;
    this.renderLayerName = renderLayerName;
  }
}
