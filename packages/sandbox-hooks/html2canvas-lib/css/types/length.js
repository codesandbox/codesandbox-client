import { TokenType } from '../syntax/tokenizer';
export const isLength = (token) => token.type === TokenType.NUMBER_TOKEN || token.type === TokenType.DIMENSION_TOKEN;
