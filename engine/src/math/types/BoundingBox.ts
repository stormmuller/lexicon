import { Vector2 } from './Vector2';

export class BoundingBox {
  point: Vector2;
  dimentions: Vector2;

  constructor(point: Vector2, dimentions: Vector2) {
    this.point = point;
    this.dimentions = dimentions;
  }

  public get minX(): number {
    return this.point.x; 
  }

  public get maxX(): number {
    return this.point.x + this.dimentions.x; 
  }
  
  public get minY(): number {
    return this.point.y; 
  }

  public get maxY(): number {
    return this.point.y + this.dimentions.y; 
  }

  public contains(point: Vector2): boolean {
    const inXBounds = point.x >= this.minX && point.x <= this.maxX;
    const inYBounds = point.y >= this.minY && point.y <= this.maxY;

    return inXBounds && inYBounds;
  }
}
