import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var FONT_STYLE;
(function (FONT_STYLE) {
    FONT_STYLE["NORMAL"] = "normal";
    FONT_STYLE["ITALIC"] = "italic";
    FONT_STYLE["OBLIQUE"] = "oblique";
})(FONT_STYLE || (FONT_STYLE = {}));
export const fontStyle = {
    name: 'font-style',
    initialValue: 'normal',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (overflow) => {
        switch (overflow) {
            case 'oblique':
                return FONT_STYLE.OBLIQUE;
            case 'italic':
                return FONT_STYLE.ITALIC;
            case 'normal':
            default:
                return FONT_STYLE.NORMAL;
        }
    }
};
