"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.doPropValidation = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const lodash_1 = require("lodash");
const common_1 = require("../tagProviders/common");
function doPropValidation(document, htmlDocument, info) {
    var _a;
    const diagnostics = [];
    const childComponentToProps = {};
    (_a = info.componentInfo.childComponents) === null || _a === void 0 ? void 0 : _a.forEach(c => {
        var _a;
        if (c.info && c.info.componentInfo.props) {
            childComponentToProps[c.name] = (_a = c.info) === null || _a === void 0 ? void 0 : _a.componentInfo.props.filter(el => el.required);
        }
    });
    traverseNodes(htmlDocument.roots, n => {
        if (n.tag) {
            const foundTag = common_1.getSameTagInSet(childComponentToProps, n.tag);
            if (foundTag) {
                const d = generateDiagnostic(n, foundTag, document);
                if (d) {
                    diagnostics.push(d);
                }
            }
        }
    });
    return diagnostics;
}
exports.doPropValidation = doPropValidation;
function traverseNodes(nodes, f) {
    if (nodes.length === 0) {
        return;
    }
    for (const node of nodes) {
        f(node);
        traverseNodes(node.children, f);
    }
}
function generateDiagnostic(n, definedProps, document) {
    // Ignore diagnostic when have `v-bind`, `v-bind:[key]`, `:[key]`
    if (n.attributeNames.some(prop => prop === 'v-bind' || prop.startsWith('v-bind:[') || prop.startsWith(':['))) {
        return undefined;
    }
    const seenProps = n.attributeNames.map(attr => {
        var _a, _b;
        return {
            name: attr,
            normalized: normalizeHtmlAttributeNameToKebabCase(attr, (_b = (_a = definedProps.find(prop => prop.isBoundToModel)) === null || _a === void 0 ? void 0 : _a.name) !== null && _b !== void 0 ? _b : 'value')
        };
    });
    const requiredProps = definedProps.map(prop => {
        return Object.assign(Object.assign({}, prop), { normalized: lodash_1.kebabCase(prop.name) });
    });
    const missingProps = [];
    requiredProps.forEach(requiredProp => {
        if (!seenProps.map(s => s.normalized).includes(requiredProp.normalized)) {
            missingProps.push(requiredProp);
        }
    });
    if (missingProps.length === 0) {
        return undefined;
    }
    return {
        severity: missingProps.some(p => p.hasObjectValidator) ? vscode_languageserver_types_1.DiagnosticSeverity.Error : vscode_languageserver_types_1.DiagnosticSeverity.Warning,
        message: `<${n.tag}> misses props: ${missingProps.map(p => p.normalized).join(', ')}\n`,
        range: {
            start: document.positionAt(n.start),
            end: document.positionAt(n.end)
        }
    };
}
function normalizeHtmlAttributeNameToKebabCase(attr, modelProp) {
    let result = attr;
    // v-model.trim
    if (!result.startsWith('v-model:') && result.startsWith('v-model')) {
        return lodash_1.kebabCase(modelProp);
    }
    // Allow `v-model:prop` in vue 3
    if (result.startsWith('v-model:')) {
        result = attr.slice('v-model:'.length);
    }
    if (result.startsWith('v-bind:')) {
        result = attr.slice('v-bind:'.length);
    }
    else if (result.startsWith(':')) {
        result = attr.slice(':'.length);
    }
    // Remove modifiers
    if (result.includes('.')) {
        result = result.slice(0, result.indexOf('.'));
    }
    result = lodash_1.kebabCase(result);
    return result;
}
//# sourceMappingURL=vuePropValidation.js.map