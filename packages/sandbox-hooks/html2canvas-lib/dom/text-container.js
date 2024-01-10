import { TEXT_TRANSFORM } from '../css/property-descriptors/text-transform';
import { parseTextBounds } from '../css/layout/text';
export class TextContainer {
    constructor(node, styles) {
        this.text = transform(node.data, styles.textTransform);
        this.textBounds = parseTextBounds(this.text, styles, node);
    }
}
const transform = (text, transform) => {
    switch (transform) {
        case TEXT_TRANSFORM.LOWERCASE:
            return text.toLowerCase();
        case TEXT_TRANSFORM.CAPITALIZE:
            return text.replace(CAPITALIZE, capitalize);
        case TEXT_TRANSFORM.UPPERCASE:
            return text.toUpperCase();
        default:
            return text;
    }
};
const CAPITALIZE = /(^|\s|:|-|\(|\))([a-z])/g;
const capitalize = (m, p1, p2) => {
    if (m.length > 0) {
        return p1 + p2.toUpperCase();
    }
    return m;
};
