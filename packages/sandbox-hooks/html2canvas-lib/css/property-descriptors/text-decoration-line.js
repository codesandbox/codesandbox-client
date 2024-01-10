import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentToken } from '../syntax/parser';
export const textDecorationLine = {
    name: 'text-decoration-line',
    initialValue: 'none',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        return tokens
            .filter(isIdentToken)
            .map(token => {
            switch (token.value) {
                case 'underline':
                    return 1 /* UNDERLINE */;
                case 'overline':
                    return 2 /* OVERLINE */;
                case 'line-through':
                    return 3 /* LINE_THROUGH */;
                case 'none':
                    return 4 /* BLINK */;
            }
            return 0 /* NONE */;
        })
            .filter(line => line !== 0 /* NONE */);
    }
};
