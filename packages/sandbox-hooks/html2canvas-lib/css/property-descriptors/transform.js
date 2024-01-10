import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { TokenType } from '../syntax/tokenizer';
export const transform = {
    name: 'transform',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.VALUE,
    parse: (token) => {
        if (token.type === TokenType.IDENT_TOKEN && token.value === 'none') {
            return null;
        }
        if (token.type === TokenType.FUNCTION) {
            const transformFunction = SUPPORTED_TRANSFORM_FUNCTIONS[token.name];
            if (typeof transformFunction === 'undefined') {
                throw new Error(`Attempting to parse an unsupported transform function "${token.name}"`);
            }
            return transformFunction(token.values);
        }
        return null;
    }
};
const matrix = (args) => {
    const values = args.filter(arg => arg.type === TokenType.NUMBER_TOKEN).map((arg) => arg.number);
    return values.length === 6 ? values : null;
};
// doesn't support 3D transforms at the moment
const matrix3d = (args) => {
    const values = args.filter(arg => arg.type === TokenType.NUMBER_TOKEN).map((arg) => arg.number);
    const [a1, b1, {}, {}, a2, b2, {}, {}, {}, {}, {}, {}, a4, b4, {}, {}] = values;
    return values.length === 16 ? [a1, b1, a2, b2, a4, b4] : null;
};
const SUPPORTED_TRANSFORM_FUNCTIONS = {
    matrix: matrix,
    matrix3d: matrix3d
};
