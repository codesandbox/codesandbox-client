import { parseFunctionArgs } from '../../syntax/parser';
import { TokenType } from '../../syntax/tokenizer';
import { isAngle, angle as angleType, parseNamedSide, deg } from '../angle';
import { CSSImageType } from '../image';
import { parseColorStop } from './gradient';
export const linearGradient = (tokens) => {
    let angle = deg(180);
    const stops = [];
    parseFunctionArgs(tokens).forEach((arg, i) => {
        if (i === 0) {
            const firstToken = arg[0];
            if (firstToken.type === TokenType.IDENT_TOKEN && firstToken.value === 'to') {
                angle = parseNamedSide(arg);
                return;
            }
            else if (isAngle(firstToken)) {
                angle = angleType.parse(firstToken);
                return;
            }
        }
        const colorStop = parseColorStop(arg);
        stops.push(colorStop);
    });
    return { angle, stops, type: CSSImageType.LINEAR_GRADIENT };
};
