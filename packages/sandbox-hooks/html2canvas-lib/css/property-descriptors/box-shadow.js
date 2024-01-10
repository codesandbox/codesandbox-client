import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentWithValue, parseFunctionArgs } from '../syntax/parser';
import { ZERO_LENGTH } from '../types/length-percentage';
import { color } from '../types/color';
import { isLength } from '../types/length';
export const boxShadow = {
    name: 'box-shadow',
    initialValue: 'none',
    type: PropertyDescriptorParsingType.LIST,
    prefix: false,
    parse: (tokens) => {
        if (tokens.length === 1 && isIdentWithValue(tokens[0], 'none')) {
            return [];
        }
        return parseFunctionArgs(tokens).map((values) => {
            const shadow = {
                color: 0x000000ff,
                offsetX: ZERO_LENGTH,
                offsetY: ZERO_LENGTH,
                blur: ZERO_LENGTH,
                spread: ZERO_LENGTH,
                inset: false
            };
            let c = 0;
            for (let i = 0; i < values.length; i++) {
                const token = values[i];
                if (isIdentWithValue(token, 'inset')) {
                    shadow.inset = true;
                }
                else if (isLength(token)) {
                    if (c === 0) {
                        shadow.offsetX = token;
                    }
                    else if (c === 1) {
                        shadow.offsetY = token;
                    }
                    else if (c === 2) {
                        shadow.blur = token;
                    }
                    else {
                        shadow.spread = token;
                    }
                    c++;
                }
                else {
                    shadow.color = color.parse(token);
                }
            }
            return shadow;
        });
    }
};
