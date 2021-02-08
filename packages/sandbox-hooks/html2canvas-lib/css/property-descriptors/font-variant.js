import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentToken } from '../syntax/parser';
export const fontVariant = {
    name: 'font-variant',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens) => {
        return tokens.filter(isIdentToken).map(token => token.value);
    }
};
