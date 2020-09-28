"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function transformTemplate(program) {
    const template = program.templateBody;
    if (!template) {
        return [];
    }
    function traverseChildren(children) {
    }
    return traverseChildren(template.children);
}
//# sourceMappingURL=getVBindMappings.js.map