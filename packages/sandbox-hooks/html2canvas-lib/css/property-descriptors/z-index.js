import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isNumberToken } from '../syntax/parser';
import { TokenType } from '../syntax/tokenizer';
export const zIndex = {
    name: 'z-index',
    initialValue: 'auto',
    prefix: false,
    type: PropertyDescriptorParsingType.VALUE,
    parse: (token) => {
        if (token.type === TokenType.IDENT_TOKEN) {
            return { auto: true, order: 0 };
        }
        if (isNumberToken(token)) {
            return { auto: false, order: token.number };
        }
        throw new Error(`Invalid z-index number parsed`);
    }
};
