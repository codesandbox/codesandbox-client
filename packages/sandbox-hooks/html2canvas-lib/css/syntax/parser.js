import { EOF_TOKEN, Tokenizer, TokenType } from './tokenizer';
export class Parser {
    constructor(tokens) {
        this._tokens = tokens;
    }
    static create(value) {
        const tokenizer = new Tokenizer();
        tokenizer.write(value);
        return new Parser(tokenizer.read());
    }
    static parseValue(value) {
        return Parser.create(value).parseComponentValue();
    }
    static parseValues(value) {
        return Parser.create(value).parseComponentValues();
    }
    parseComponentValue() {
        let token = this.consumeToken();
        while (token.type === TokenType.WHITESPACE_TOKEN) {
            token = this.consumeToken();
        }
        if (token.type === TokenType.EOF_TOKEN) {
            throw new SyntaxError(`Error parsing CSS component value, unexpected EOF`);
        }
        this.reconsumeToken(token);
        const value = this.consumeComponentValue();
        do {
            token = this.consumeToken();
        } while (token.type === TokenType.WHITESPACE_TOKEN);
        if (token.type === TokenType.EOF_TOKEN) {
            return value;
        }
        throw new SyntaxError(`Error parsing CSS component value, multiple values found when expecting only one`);
    }
    parseComponentValues() {
        const values = [];
        while (true) {
            let value = this.consumeComponentValue();
            if (value.type === TokenType.EOF_TOKEN) {
                return values;
            }
            values.push(value);
            values.push();
        }
    }
    consumeComponentValue() {
        const token = this.consumeToken();
        switch (token.type) {
            case TokenType.LEFT_CURLY_BRACKET_TOKEN:
            case TokenType.LEFT_SQUARE_BRACKET_TOKEN:
            case TokenType.LEFT_PARENTHESIS_TOKEN:
                return this.consumeSimpleBlock(token.type);
            case TokenType.FUNCTION_TOKEN:
                return this.consumeFunction(token);
        }
        return token;
    }
    consumeSimpleBlock(type) {
        const block = { type, values: [] };
        let token = this.consumeToken();
        while (true) {
            if (token.type === TokenType.EOF_TOKEN || isEndingTokenFor(token, type)) {
                return block;
            }
            this.reconsumeToken(token);
            block.values.push(this.consumeComponentValue());
            token = this.consumeToken();
        }
    }
    consumeFunction(functionToken) {
        const cssFunction = {
            name: functionToken.value,
            values: [],
            type: TokenType.FUNCTION
        };
        while (true) {
            const token = this.consumeToken();
            if (token.type === TokenType.EOF_TOKEN || token.type === TokenType.RIGHT_PARENTHESIS_TOKEN) {
                return cssFunction;
            }
            this.reconsumeToken(token);
            cssFunction.values.push(this.consumeComponentValue());
        }
    }
    consumeToken() {
        const token = this._tokens.shift();
        return typeof token === 'undefined' ? EOF_TOKEN : token;
    }
    reconsumeToken(token) {
        this._tokens.unshift(token);
    }
}
export const isDimensionToken = (token) => token.type === TokenType.DIMENSION_TOKEN;
export const isNumberToken = (token) => token.type === TokenType.NUMBER_TOKEN;
export const isIdentToken = (token) => token.type === TokenType.IDENT_TOKEN;
export const isStringToken = (token) => token.type === TokenType.STRING_TOKEN;
export const isIdentWithValue = (token, value) => isIdentToken(token) && token.value === value;
export const nonWhiteSpace = (token) => token.type !== TokenType.WHITESPACE_TOKEN;
export const nonFunctionArgSeparator = (token) => token.type !== TokenType.WHITESPACE_TOKEN && token.type !== TokenType.COMMA_TOKEN;
export const parseFunctionArgs = (tokens) => {
    const args = [];
    let arg = [];
    tokens.forEach(token => {
        if (token.type === TokenType.COMMA_TOKEN) {
            if (arg.length === 0) {
                throw new Error(`Error parsing function args, zero tokens for arg`);
            }
            args.push(arg);
            arg = [];
            return;
        }
        if (token.type !== TokenType.WHITESPACE_TOKEN) {
            arg.push(token);
        }
    });
    if (arg.length) {
        args.push(arg);
    }
    return args;
};
const isEndingTokenFor = (token, type) => {
    if (type === TokenType.LEFT_CURLY_BRACKET_TOKEN && token.type === TokenType.RIGHT_CURLY_BRACKET_TOKEN) {
        return true;
    }
    if (type === TokenType.LEFT_SQUARE_BRACKET_TOKEN && token.type === TokenType.RIGHT_SQUARE_BRACKET_TOKEN) {
        return true;
    }
    return type === TokenType.LEFT_PARENTHESIS_TOKEN && token.type === TokenType.RIGHT_PARENTHESIS_TOKEN;
};
