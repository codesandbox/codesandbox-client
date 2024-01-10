import { TokenType } from '../syntax/tokenizer';
import { image, isSupportedImage } from '../types/image';
import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { nonFunctionArgSeparator } from '../syntax/parser';
export const backgroundImage = {
    name: 'background-image',
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
        return tokens.filter(value => nonFunctionArgSeparator(value) && isSupportedImage(value)).map(image.parse);
    }
};
