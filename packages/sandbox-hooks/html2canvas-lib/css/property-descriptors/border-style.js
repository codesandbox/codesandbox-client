import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export var BORDER_STYLE;
(function (BORDER_STYLE) {
    BORDER_STYLE[BORDER_STYLE["NONE"] = 0] = "NONE";
    BORDER_STYLE[BORDER_STYLE["SOLID"] = 1] = "SOLID";
})(BORDER_STYLE || (BORDER_STYLE = {}));
const borderStyleForSide = (side) => ({
    name: `border-${side}-style`,
    initialValue: 'solid',
    prefix: false,
    type: PropertyDescriptorParsingType.IDENT_VALUE,
    parse: (style) => {
        switch (style) {
            case 'none':
                return BORDER_STYLE.NONE;
        }
        return BORDER_STYLE.SOLID;
    }
});
export const borderTopStyle = borderStyleForSide('top');
export const borderRightStyle = borderStyleForSide('right');
export const borderBottomStyle = borderStyleForSide('bottom');
export const borderLeftStyle = borderStyleForSide('left');
