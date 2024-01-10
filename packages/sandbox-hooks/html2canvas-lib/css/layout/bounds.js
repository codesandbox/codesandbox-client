export class Bounds {
    constructor(x, y, w, h) {
        this.left = x;
        this.top = y;
        this.width = w;
        this.height = h;
    }
    add(x, y, w, h) {
        return new Bounds(this.left + x, this.top + y, this.width + w, this.height + h);
    }
    static fromClientRect(clientRect) {
        return new Bounds(clientRect.left, clientRect.top, clientRect.width, clientRect.height);
    }
}
export const parseBounds = (node) => {
    return Bounds.fromClientRect(node.getBoundingClientRect());
};
export const parseDocumentSize = (document) => {
    const body = document.body;
    const documentElement = document.documentElement;
    if (!body || !documentElement) {
        throw new Error(`Unable to get document size`);
    }
    const width = Math.max(Math.max(body.scrollWidth, documentElement.scrollWidth), Math.max(body.offsetWidth, documentElement.offsetWidth), Math.max(body.clientWidth, documentElement.clientWidth));
    const height = Math.max(Math.max(body.scrollHeight, documentElement.scrollHeight), Math.max(body.offsetHeight, documentElement.offsetHeight), Math.max(body.clientHeight, documentElement.clientHeight));
    return new Bounds(0, 0, width, height);
};
