import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isLengthPercentage, parseLengthPercentageTuple } from '../types/length-percentage';
const borderRadiusForSide = (side) => ({
    name: `border-radius-${side}`,
    initialValue: '0 0',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => parseLengthPercentageTuple(tokens.filter(isLengthPercentage))
});
export const borderTopLeftRadius = borderRadiusForSide('top-left');
export const borderTopRightRadius = borderRadiusForSide('top-right');
export const borderBottomRightRadius = borderRadiusForSide('bottom-right');
export const borderBottomLeftRadius = borderRadiusForSide('bottom-left');
