import { TokenType } from '../syntax/tokenizer';
import { image } from '../types/image';
import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
export const listStyleImage = {
    name: 'list-style-image',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token) => {
        if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {
            return null;
        }
        return image.parse(token);
    }
};
