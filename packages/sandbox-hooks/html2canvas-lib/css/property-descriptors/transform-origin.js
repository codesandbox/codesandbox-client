import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isLengthPercentage } from '../types/length-percentage';
import { FLAG_INTEGER, TokenType } from '../syntax/tokenizer';
const DEFAULT_VALUE = {
    type: TokenType.PERCENTAGE_TOKEN,
    number: 50,
    flags: FLAG_INTEGER
};
const DEFAULT = [DEFAULT_VALUE, DEFAULT_VALUE];
export const transformOrigin = {
    name: 'transform-origin',
    initialValue: '50% 50%',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        const origins = tokens.filter(isLengthPercentage);
        if (origins.length !== 2) {
            return DEFAULT;
        }
        return [origins[0], origins[1]];
    }
};
