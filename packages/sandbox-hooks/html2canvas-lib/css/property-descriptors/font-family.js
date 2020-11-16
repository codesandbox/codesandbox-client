import { PropertyDescriptorParsingType } from '../IPropertyDescriptor';
import { TokenType } from '../syntax/tokenizer';
export const fontFamily = {
    name: `font-family`,
    initialValue: '',
    prefix: false,
    type: PropertyDescriptorParsingType.LIST,
    parse: (tokens) => {
        const accumulator = [];
        const results = [];
        tokens.forEach(token => {
            switch (token.type) {
                case TokenType.IDENT_TOKEN:
                case TokenType.STRING_TOKEN:
                    accumulator.push(token.value);
                    break;
                case TokenType.NUMBER_TOKEN:
                    accumulator.push(token.number.toString());
                    break;
                case TokenType.COMMA_TOKEN:
                    results.push(accumulator.join(' '));
                    accumulator.length = 0;
                    break;
            }
        });
        if (accumulator.length) {
            results.push(accumulator.join(' '));
        }
        return results.map(result => (result.indexOf(' ') === -1 ? result : `'${result}'`));
    }
};
