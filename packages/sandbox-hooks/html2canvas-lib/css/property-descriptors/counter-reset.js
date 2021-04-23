import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { isIdentToken, isNumberToken, nonWhiteSpace } from '../syntax/parser';
export const counterReset = {
    name: 'counter-reset',
    initialValue: 'none',
    prefix: true,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        if (tokens.length === 0) {
            return [];
        }
        const resets = [];
        const filtered = tokens.filter(nonWhiteSpace);
        for (let i = 0; i < filtered.length; i++) {
            const counter = filtered[i];
            const next = filtered[i + 1];
            if (isIdentToken(counter) && counter.value !== 'none') {
                const reset = next && isNumberToken(next) ? next.number : 0;
                resets.push({ counter: counter.value, reset });
            }
        }
        return resets;
    }
};
