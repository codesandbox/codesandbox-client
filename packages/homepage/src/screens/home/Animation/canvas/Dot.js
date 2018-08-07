// @flow
import PositionedElement from './PositionedElement';

export default class Dot extends PositionedElement {
  color: number[];
  alpha: number;
  vAlpha: number = 0;
  dvAlpha: number = -0.1;
  size: number = 1;

  minAlpha: number = 0.2;
  minSize: number = 1;

  constructor(x: number, y: number, color: number[], alpha: number) {
    super(x, y);

    this.color = color;
    this.alpha = alpha;
    const r = Math.random();
    this.minAlpha = 0.4 + r * 0.2;
    this.minSize = 0.5 + r * 2;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(${this.color.join(',')}, ${this.alpha})`;

    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, false);
    ctx.closePath();
    ctx.fill();
  }

  setAlpha(alpha: number) {
    this.alpha = Math.max(this.minAlpha, alpha);
  }

  setSize(size: number) {
    this.size = Math.max(this.minSize, size);
  }

  setColor(color: Array<number>) {
    this.color = color;
  }
}
