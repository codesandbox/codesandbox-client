import { ElementContainer } from '../element-container';
export class LIElementContainer extends ElementContainer {
    constructor(element) {
        super(element);
        this.value = element.value;
    }
}
