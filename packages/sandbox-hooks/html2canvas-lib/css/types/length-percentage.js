import { FLAG_INTEGER, TokenType } from '../syntax/tokenizer';
import { isDimensionToken } from '../syntax/parser';
import { isLength } from './length';
export const isLengthPercentage = (token) => token.type === TokenType.PERCENTAGE_TOKEN || isLength(token);
export const parseLengthPercentageTuple = (tokens) => tokens.length > 1 ? [tokens[0], tokens[1]] : [tokens[0]];
export const ZERO_LENGTH = {
    type: TokenType.NUMBER_TOKEN,
    number: 0,
    flags: FLAG_INTEGER
};
export const FIFTY_PERCENT = {
    type: TokenType.PERCENTAGE_TOKEN,
    number: 50,
    flags: FLAG_INTEGER
};
export const HUNDRED_PERCENT = {
    type: TokenType.PERCENTAGE_TOKEN,
    number: 100,
    flags: FLAG_INTEGER
};
export const getAbsoluteValueForTuple = (tuple, width, height) => {
    let [x, y] = tuple;
    return [getAbsoluteValue(x, width), getAbsoluteValue(typeof y !== 'undefined' ? y : x, height)];
};
export const getAbsoluteValue = (token, parent) => {
    if (token.type === TokenType.PERCENTAGE_TOKEN) {
        return (token.number / 100) * parent;
    }
    if (isDimensionToken(token)) {
        switch (token.unit) {
            case 'rem':
            case 'em':
                return 16 * token.number; // TODO use correct font-size
            case 'px':
            default:
                return token.number;
        }
    }
    return token.number;
};
