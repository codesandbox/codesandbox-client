"use strict";
exports.__esModule = true;
exports.FormatHandleBlockComment = void 0;
var utility_1 = require("../utility");
function FormatHandleBlockComment(text, STATE) {
    if (/^[\t ]*\/\*/.test(text)) {
        return utility_1.replaceSpacesOrTabs(text, STATE);
    }
    return utility_1.replaceWithOffset(text, utility_1.getIndentationOffset(text, STATE.CONTEXT.blockCommentDistance + 1, STATE.CONFIG.tabSize).offset, STATE);
}
exports.FormatHandleBlockComment = FormatHandleBlockComment;
