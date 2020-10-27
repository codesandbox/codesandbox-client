"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isInsideInterpolation = void 0;
const vue_eslint_parser_1 = require("vue-eslint-parser");
const PARSER_PRE = '<template>';
const PARSER_POS = '</template>';
function isInsideInterpolation(node, nodeText, relativePos) {
    // Case {{ }}
    if (node.isInterpolation && relativePos >= '{{'.length && relativePos <= nodeText.length - '}}'.length) {
        return true;
    }
    // Case v-, : or @ directives
    const templateBody = vue_eslint_parser_1.parse(PARSER_PRE + nodeText + PARSER_POS, {}).templateBody;
    if (!templateBody) {
        return false;
    }
    const onlyChild = templateBody.children[0];
    if (!onlyChild || onlyChild.type !== 'VElement') {
        return false;
    }
    if (!onlyChild.startTag || !onlyChild.range) {
        return false;
    }
    if (!isInsideRange(onlyChild.startTag)) {
        return false;
    }
    for (const a of onlyChild.startTag.attributes) {
        if (isInsideRange(a) && a.directive) {
            if (a.value) {
                return isInsideRange(a.value);
            }
        }
    }
    return false;
    function isInsideRange(node) {
        const [start, end] = node.range;
        return start - PARSER_PRE.length < relativePos && end - PARSER_PRE.length > relativePos;
    }
}
exports.isInsideInterpolation = isInsideInterpolation;
//# sourceMappingURL=isInsideInterpolation.js.map