import { CSSParsedDeclaration } from '../css/index';
import { parseBounds } from '../css/layout/bounds';
import { isHTMLElementNode } from './node-parser';
export class ElementContainer {
    constructor(element) {
        this.styles = new CSSParsedDeclaration(window.getComputedStyle(element, null));
        this.textNodes = [];
        this.elements = [];
        if (this.styles.transform !== null && isHTMLElementNode(element)) {
            // getBoundingClientRect takes transforms into account
            element.style.transform = 'none';
        }
        this.bounds = parseBounds(element);
        this.flags = 0;
    }
}
