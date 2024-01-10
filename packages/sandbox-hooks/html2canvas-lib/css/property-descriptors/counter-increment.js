import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isNumberToken, nonWhiteSpace } from '../syntax/parser';
import { TokenType } from '../syntax/tokenizer';
export const counterIncrement = {
    name: 'counter-increment',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        if (tokens.length === 0) {
            return null;
        }
        const first = tokens[0];
        if (first.type === TokenType.IDENT_TOKEN && first.value === 'none') {
            return null;
        }
        const increments = [];
        const filtered = tokens.filter(nonWhiteSpace);
        for (let i = 0; i < filtered.length; i++) {
            const counter = filtered[i];
            const next = filtered[i + 1];
            if (counter.type === TokenType.IDENT_TOKEN) {
                const increment = next && isNumberToken(next) ? next.number : 1;
                increments.push({ counter: counter.value, increment });
            }
        }
        return increments;
    }
};
