import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { TokenType } from '../syntax/tokenizer';
export const letterSpacing = {
    name: 'letter-spacing',
    initialValue: '0',
    prefix: false,
    type: PropertyDescriptorParsingType.VALUE,
    parse: (token) => {
        if (token.type === TokenType.IDENT_TOKEN && token.value === 'normal') {
            return 0;
        }
        if (token.type === TokenType.NUMBER_TOKEN) {
            return token.number;
        }
        if (token.type === TokenType.DIMENSION_TOKEN) {
            return token.number;
        }
        return 0;
    }
};
