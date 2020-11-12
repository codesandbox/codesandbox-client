import { ElementContainer } from '../element-container';
export class OLElementContainer extends ElementContainer {
    constructor(element) {
        super(element);
        this.start = element.start;
        this.reversed = typeof element.reversed === 'boolean' && element.reversed === true;
    }
}
