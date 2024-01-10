import { PathType } from './path';
export class Vector {
    constructor(x, y) {
        this.type = PathType.VECTOR;
        this.x = x;
        this.y = y;
    }
    add(deltaX, deltaY) {
        return new Vector(this.x + deltaX, this.y + deltaY);
    }
}
export const isVector = (path) => path.type === PathType.VECTOR;
