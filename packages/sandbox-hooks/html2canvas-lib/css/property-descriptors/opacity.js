import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isNumberToken } from '../syntax/parser';
export const opacity = {
    name: 'opacity',
    initialValue: '1',
    type: PropertyDescriptorParsingType.VALUE,
    prefix: false,
    parse: (token) => {
        if (isNumberToken(token)) {
            return token.number;
        }
        return 1;
    }
};
