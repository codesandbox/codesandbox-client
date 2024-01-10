export class TransformEffect {
    constructor(offsetX, offsetY, matrix) {
        this.type = 0 /* TRANSFORM */;
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.matrix = matrix;
        this.target = 2 /* BACKGROUND_BORDERS */ | 4 /* CONTENT */;
    }
}
export class ClipEffect {
    constructor(path, target) {
        this.type = 1 /* CLIP */;
        this.target = target;
        this.path = path;
    }
}
export const isTransformEffect = (effect) => effect.type === 0 /* TRANSFORM */;
export const isClipEffect = (effect) => effect.type === 1 /* CLIP */;
