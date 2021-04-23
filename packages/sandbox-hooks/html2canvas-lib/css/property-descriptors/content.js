import { TokenType } from '../syntax/tokenizer';
import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export const content = {
    name: 'content',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens) => {
        if (tokens.length === 0) {
            return [];
        }
        const first = tokens[0];
        if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
            return [];
        }
        return tokens;
    }
};
