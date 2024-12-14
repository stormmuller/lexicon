import { ecs } from '../..';
import { Component } from '../../ecs';
import { BoundingBox } from '../../math';

export type LayoutBoxDirection = 'horizontal' | 'vertical';

export class LayoutBoxComponent implements Component {
  public name: symbol;
  sortedEntities: ecs.Entity[];
  boundingBox: BoundingBox;
  spaceBetween: number;
  layoutBoxDirection: LayoutBoxDirection;

  static symbol = Symbol('LayoutBox');

  constructor(
    sortedEntities: Array<ecs.Entity>,
    boundingBox: BoundingBox,
    spaceBetween: number = 0,
    layoutBoxDirection: LayoutBoxDirection = 'vertical',
  ) {
    this.name = LayoutBoxComponent.symbol;
    this.sortedEntities = sortedEntities;
    this.boundingBox = boundingBox;
    this.spaceBetween = spaceBetween;
    this.layoutBoxDirection = layoutBoxDirection;
  }
}
