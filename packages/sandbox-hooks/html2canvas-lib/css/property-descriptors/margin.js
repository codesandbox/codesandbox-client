import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
const marginForSide = (side) => ({
    name: `margin-${side}`,
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.TOKEN_VALUE
});
export const marginTop = marginForSide('top');
export const marginRight = marginForSide('right');
export const marginBottom = marginForSide('bottom');
export const marginLeft = marginForSide('left');
