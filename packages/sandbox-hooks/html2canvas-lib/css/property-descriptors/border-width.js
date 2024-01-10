import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isDimensionToken } from '../syntax/parser';
const borderWidthForSide = (side) => ({
    name: `border-${side}-width`,
    initialValue: '0',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token) => {
        if (isDimensionToken(token)) {
            return token.number;
        }
        return 0;
    }
});
export const borderTopWidth = borderWidthForSide('top');
export const borderRightWidth = borderWidthForSide('right');
export const borderBottomWidth = borderWidthForSide('bottom');
export const borderLeftWidth = borderWidthForSide('left');
