// @flow
import PositionedElement from './PositionedElement';

export default class Dot extends PositionedElement {
  color: number[];
  alpha: number;
  vAlpha: number = 0;
  dvAlpha: number = -0.1;
  size: number = 1;

  constructor(x: number, y: number, color: number[], alpha: number) {
    super(x, y);

    this.color = color;
    this.alpha = alpha;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    ctx.fillStyle = `rgba(${this.color.join(',')}, ${this.alpha})`;
    ctx.fill();
  }

  setAlpha(alpha: number) {
    this.alpha = alpha;
  }

  setSize(size: number) {
    this.size = size;
  }

  setColor(color: Array<number>) {
    this.color = color;
  }
}
