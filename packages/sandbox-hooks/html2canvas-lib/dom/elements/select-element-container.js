import { ElementContainer } from '../element-container';
export class SelectElementContainer extends ElementContainer {
    constructor(element) {
        super(element);
        const option = element.options[element.selectedIndex || 0];
        this.value = option ? option.text || '' : '';
    }
}
