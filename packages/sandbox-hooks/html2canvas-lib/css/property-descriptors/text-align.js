import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var TEXT_ALIGN;
(function (TEXT_ALIGN) {
    TEXT_ALIGN[TEXT_ALIGN["LEFT"] = 0] = "LEFT";
    TEXT_ALIGN[TEXT_ALIGN["CENTER"] = 1] = "CENTER";
    TEXT_ALIGN[TEXT_ALIGN["RIGHT"] = 2] = "RIGHT";
})(TEXT_ALIGN || (TEXT_ALIGN = {}));
export const textAlign = {
    name: 'text-align',
    initialValue: 'left',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (textAlign) => {
        switch (textAlign) {
            case 'right':
                return TEXT_ALIGN.RIGHT;
            case 'center':
            case 'justify':
                return TEXT_ALIGN.CENTER;
            case 'left':
            default:
                return TEXT_ALIGN.LEFT;
        }
    }
};
