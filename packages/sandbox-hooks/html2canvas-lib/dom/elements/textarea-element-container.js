import { ElementContainer } from '../element-container';
export class TextareaElementContainer extends ElementContainer {
    constructor(element) {
        super(element);
        this.value = element.value;
    }
}
