import { ElementContainer } from '../element-container';
export class CanvasElementContainer extends ElementContainer {
    constructor(canvas) {
        super(canvas);
        this.canvas = canvas;
        this.intrinsicWidth = canvas.width;
        this.intrinsicHeight = canvas.height;
    }
}
