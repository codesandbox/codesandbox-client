import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
const paddingForSide = (side) => ({
    name: `padding-${side}`,
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.TYPE_VALUE,
    format: 'length-percentage'
});
export const paddingTop = paddingForSide('top');
export const paddingRight = paddingForSide('right');
export const paddingBottom = paddingForSide('bottom');
export const paddingLeft = paddingForSide('left');
