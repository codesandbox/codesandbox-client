"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const scaffoldCompletion_1 = require("./scaffoldCompletion");
function getVueMode() {
    let config = {};
    return {
        getId() {
            return 'vue';
        },
        configure(c) {
            config = c;
        },
        doComplete(document, position) {
            if (!config.vetur.completion.useScaffoldSnippets) {
                return { isIncomplete: false, items: [] };
            }
            const offset = document.offsetAt(position);
            const text = document.getText().slice(0, offset);
            const needBracket = /<\w*$/.test(text);
            const ret = scaffoldCompletion_1.doScaffoldComplete();
            // remove duplicate <
            if (needBracket) {
                ret.items.forEach(item => {
                    item.insertText = item.insertText.slice(1);
                });
            }
            return ret;
        },
        onDocumentRemoved() { },
        dispose() { }
    };
}
exports.getVueMode = getVueMode;
//# sourceMappingURL=index.js.map