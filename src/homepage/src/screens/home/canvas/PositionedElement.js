// @flow

export default class PositionedElement {
  x: number;
  y: number;
  vx: number = 0;
  vy: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  setSpeed(vx: number, vy: number) {
    this.vx = vx;
    this.vy = vy;
  }

  update(delta: number) {
    this.x += this.vx * delta;
    this.y += this.vy * delta;
  }
}
