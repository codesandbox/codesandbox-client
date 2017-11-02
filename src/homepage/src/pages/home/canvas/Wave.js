import PositionedElement from './PositionedElement';

export default class Wave extends PositionedElement {
  waveRadius: number = 0;
  vR: number = 4;

  waveWidth: number = 500;

  constructor(x: number, y: number, color: number[]) {
    super(x, y);

    this.color = color;
  }

  update(delta) {
    super.update(delta);

    this.waveRadius += delta * this.vR;
    this.waveWidth = Math.max(500, this.waveRadius * 0.4);
  }
}
