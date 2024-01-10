import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentToken } from '../syntax/parser';
export const backgroundOrigin = {
    name: 'background-origin',
    initialValue: 'border-box',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        return tokens.map(token => {
            if (isIdentToken(token)) {
                switch (token.value) {
                    case 'padding-box':
                        return 1 /* PADDING_BOX */;
                    case 'content-box':
                        return 2 /* CONTENT_BOX */;
                }
            }
            return 0 /* BORDER_BOX */;
        });
    }
};
