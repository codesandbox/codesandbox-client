"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.injectVueTemplate = exports.createUpdater = exports.parseVueTemplate = exports.parseVueScript = void 0;
const path = require("path");
const vue_eslint_parser_1 = require("vue-eslint-parser");
const vscode_uri_1 = require("vscode-uri");
const embeddedSupport_1 = require("../../embeddedSupport/embeddedSupport");
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const transformTemplate_1 = require("./transformTemplate");
const serviceHost_1 = require("./serviceHost");
const sourceMap_1 = require("./sourceMap");
const util_1 = require("./util");
const lodash_1 = require("lodash");
const importedComponentName = '__vlsComponent';
function parseVueScript(text) {
    const doc = vscode_languageserver_types_1.TextDocument.create('test://test/test.vue', 'vue', 0, text);
    const regions = embeddedSupport_1.getVueDocumentRegions(doc);
    const script = regions.getSingleTypeDocument('script');
    return script.getText();
}
exports.parseVueScript = parseVueScript;
function parseVueScriptSrc(text) {
    const doc = vscode_languageserver_types_1.TextDocument.create('test://test/test.vue', 'vue', 0, text);
    const regions = embeddedSupport_1.getVueDocumentRegions(doc);
    return regions.getImportedScripts()[0];
}
function parseVueTemplate(text) {
    const doc = vscode_languageserver_types_1.TextDocument.create('test://test/test.vue', 'vue', 0, text);
    const regions = embeddedSupport_1.getVueDocumentRegions(doc);
    const template = regions.getSingleTypeDocument('template');
    if (template.languageId !== 'vue-html') {
        return '';
    }
    const rawText = template.getText();
    // skip checking on empty template
    if (rawText.replace(/\s/g, '') === '') {
        return '';
    }
    return rawText.replace(/ {10}/, '<template>') + '</template>';
}
exports.parseVueTemplate = parseVueTemplate;
function createUpdater(tsModule, allChildComponentsInfo) {
    const clssf = tsModule.createLanguageServiceSourceFile;
    const ulssf = tsModule.updateLanguageServiceSourceFile;
    const scriptKindTracker = new WeakMap();
    const modificationTracker = new WeakSet();
    const printer = tsModule.createPrinter();
    function isTSLike(scriptKind) {
        return scriptKind === tsModule.ScriptKind.TS || scriptKind === tsModule.ScriptKind.TSX;
    }
    function modifySourceFile(fileName, sourceFile, scriptSnapshot, version, scriptKind) {
        if (modificationTracker.has(sourceFile)) {
            return;
        }
        if (util_1.isVueFile(fileName) && !isTSLike(scriptKind)) {
            modifyVueScript(tsModule, sourceFile);
            modificationTracker.add(sourceFile);
            return;
        }
    }
    /**
     * The transformed TS AST has synthetic nodes so language features would fail on them
     * Use printer to print the AST as re-parse the source to get a valid SourceFile
     */
    function recreateVueTemplateSourceFile(vueTemplateFileName, sourceFile, scriptSnapshot) {
        var _a;
        // TODO: share the logic of transforming the code into AST
        // with the template mode
        const vueText = scriptSnapshot.getText(0, scriptSnapshot.getLength());
        const templateCode = parseVueTemplate(vueText);
        const scriptSrc = parseVueScriptSrc(vueText);
        const program = vue_eslint_parser_1.parse(templateCode, { sourceType: 'module' });
        const childComponentNames = (_a = allChildComponentsInfo.get(vueTemplateFileName)) === null || _a === void 0 ? void 0 : _a.map(c => lodash_1.snakeCase(c.name));
        let expressions = [];
        try {
            expressions = transformTemplate_1.getTemplateTransformFunctions(tsModule, childComponentNames).transformTemplate(program, templateCode);
            injectVueTemplate(tsModule, sourceFile, expressions, scriptSrc);
        }
        catch (err) {
            console.log(`Failed to transform template of ${vueTemplateFileName}`);
            console.log(err);
        }
        let newText = printer.printFile(sourceFile);
        if (allChildComponentsInfo.has(vueTemplateFileName)) {
            const childComponents = allChildComponentsInfo.get(vueTemplateFileName);
            newText += convertChildComponentsInfoToSource(childComponents);
        }
        const newSourceFile = tsModule.createSourceFile(vueTemplateFileName, newText, sourceFile.languageVersion, true /* setParentNodes: Need this to walk the AST */, tsModule.ScriptKind.JS);
        const templateFsPath = vscode_uri_1.URI.file(vueTemplateFileName).fsPath;
        const sourceMapNodes = sourceMap_1.generateSourceMap(tsModule, sourceFile, newSourceFile);
        serviceHost_1.templateSourceMap[templateFsPath] = sourceMapNodes;
        serviceHost_1.templateSourceMap[templateFsPath.slice(0, -'.template'.length)] = sourceMapNodes;
        return newSourceFile;
    }
    function createLanguageServiceSourceFile(fileName, scriptSnapshot, scriptTarget, version, setNodeParents, scriptKind) {
        let sourceFile = clssf(fileName, scriptSnapshot, scriptTarget, version, setNodeParents, scriptKind);
        scriptKindTracker.set(sourceFile, scriptKind);
        if (util_1.isVirtualVueTemplateFile(fileName)) {
            sourceFile = recreateVueTemplateSourceFile(fileName, sourceFile, scriptSnapshot);
            modificationTracker.add(sourceFile);
        }
        else {
            modifySourceFile(fileName, sourceFile, scriptSnapshot, version, scriptKind);
        }
        return sourceFile;
    }
    function updateLanguageServiceSourceFile(sourceFile, scriptSnapshot, version, textChangeRange, aggressiveChecks) {
        const scriptKind = scriptKindTracker.get(sourceFile);
        sourceFile = ulssf(sourceFile, scriptSnapshot, version, textChangeRange, aggressiveChecks);
        if (util_1.isVirtualVueTemplateFile(sourceFile.fileName)) {
            sourceFile = recreateVueTemplateSourceFile(sourceFile.fileName, sourceFile, scriptSnapshot);
            modificationTracker.add(sourceFile);
        }
        else {
            modifySourceFile(sourceFile.fileName, sourceFile, scriptSnapshot, version, scriptKind);
        }
        return sourceFile;
    }
    return {
        createLanguageServiceSourceFile,
        updateLanguageServiceSourceFile
    };
}
exports.createUpdater = createUpdater;
function modifyVueScript(tsModule, sourceFile) {
    const exportDefaultObject = sourceFile.statements.find(st => st.kind === tsModule.SyntaxKind.ExportAssignment &&
        st.expression.kind === tsModule.SyntaxKind.ObjectLiteralExpression);
    if (exportDefaultObject) {
        // 1. add `import Vue from 'vue'
        // (the span of the inserted statement must be (0,0) to avoid overlapping existing statements)
        const setZeroPos = getWrapperRangeSetter(tsModule, { pos: 0, end: 0 });
        const vueImport = setZeroPos(tsModule.createImportDeclaration(undefined, undefined, setZeroPos(tsModule.createImportClause(tsModule.createIdentifier('__vueEditorBridge'), undefined)), setZeroPos(tsModule.createLiteral('vue-editor-bridge'))));
        const statements = sourceFile.statements;
        statements.unshift(vueImport);
        // 2. find the export default and wrap it in `__vueEditorBridge(...)` if it exists and is an object literal
        // (the span of the function construct call and *all* its members must be the same as the object literal it wraps)
        const objectLiteral = exportDefaultObject.expression;
        const setObjPos = getWrapperRangeSetter(tsModule, objectLiteral);
        const vue = tsModule.setTextRange(tsModule.createIdentifier('__vueEditorBridge'), {
            pos: objectLiteral.pos,
            end: objectLiteral.pos + 1
        });
        exportDefaultObject.expression = setObjPos(tsModule.createCall(vue, undefined, [objectLiteral]));
        setObjPos(exportDefaultObject.expression.arguments);
    }
}
/**
 * Wrap render function with component options in the script block
 * to validate its types
 */
function injectVueTemplate(tsModule, sourceFile, renderBlock, scriptSrc) {
    // add import statement for corresponding Vue file
    // so that we acquire the component type from it.
    let componentFilePath;
    if (scriptSrc) {
        // When script block refers external file (<script src="./MyComp.ts"></script>).
        // We need to strip `.ts` suffix to avoid a compilation error.
        componentFilePath = scriptSrc.replace(/\.ts$/, '');
    }
    else {
        // Importing original `.vue` file will get component type when the script is written by inline.
        componentFilePath = './' + path.basename(sourceFile.fileName.slice(0, -'.template'.length));
    }
    const componentImport = tsModule.createImportDeclaration(undefined, undefined, tsModule.createImportClause(tsModule.createIdentifier(importedComponentName), undefined), tsModule.createLiteral(componentFilePath));
    // import helper type to handle Vue's private methods
    const helperImport = tsModule.createImportDeclaration(undefined, undefined, tsModule.createImportClause(undefined, tsModule.createNamedImports([
        tsModule.createImportSpecifier(undefined, tsModule.createIdentifier(transformTemplate_1.renderHelperName)),
        tsModule.createImportSpecifier(undefined, tsModule.createIdentifier(transformTemplate_1.componentHelperName)),
        tsModule.createImportSpecifier(undefined, tsModule.createIdentifier(transformTemplate_1.iterationHelperName)),
        tsModule.createImportSpecifier(undefined, tsModule.createIdentifier(transformTemplate_1.componentDataName))
    ])), tsModule.createLiteral('vue-editor-bridge'));
    // wrap render code with a function decralation
    // with `this` type of component.
    const statements = renderBlock.map(exp => tsModule.createExpressionStatement(exp));
    const renderElement = tsModule.createExpressionStatement(tsModule.createCall(tsModule.createIdentifier(transformTemplate_1.renderHelperName), undefined, [
        // Reference to the component
        tsModule.createIdentifier(importedComponentName),
        // A function simulating the render function
        tsModule.createFunctionExpression(undefined, undefined, undefined, undefined, [], undefined, tsModule.createBlock(statements))
    ]));
    // replace the original statements with wrapped code.
    sourceFile.statements = tsModule.createNodeArray([componentImport, helperImport, renderElement]);
    // Update external module indicator to the transformed template node,
    // otherwise symbols in this template (e.g. __Component) will be put
    // into global namespace and it causes duplicated identifier error.
    sourceFile.externalModuleIndicator = componentImport;
}
exports.injectVueTemplate = injectVueTemplate;
/** Create a function that calls setTextRange on synthetic wrapper nodes that need a valid range */
function getWrapperRangeSetter(tsModule, wrapped) {
    return wrapperNode => tsModule.setTextRange(wrapperNode, wrapped);
}
function convertChildComponentsInfoToSource(childComponents) {
    let src = '';
    childComponents.forEach(c => {
        var _a, _b;
        const componentDataInterfaceName = transformTemplate_1.componentDataName + '__' + lodash_1.snakeCase(c.name);
        const componentHelperInterfaceName = transformTemplate_1.componentHelperName + '__' + lodash_1.snakeCase(c.name);
        const propTypeStrings = [];
        (_b = (_a = c.info) === null || _a === void 0 ? void 0 : _a.componentInfo.props) === null || _b === void 0 ? void 0 : _b.forEach(p => {
            let typeKey = p.required ? lodash_1.kebabCase(p.name) : lodash_1.kebabCase(p.name) + '?';
            if (typeKey.indexOf('-') !== -1) {
                typeKey = `'` + typeKey + `'`;
            }
            if (p.typeString) {
                propTypeStrings.push(`${typeKey}: ${p.typeString}`);
            }
            else {
                propTypeStrings.push(`${typeKey}: any`);
            }
        });
        propTypeStrings.push('[other: string]: any');
        src += `
interface ${componentDataInterfaceName}<T> extends ${transformTemplate_1.componentDataName}<T> {
  props: { ${propTypeStrings.join(', ')} }
}
declare const ${componentHelperInterfaceName}: {
  <T>(
    vm: T,
    tag: string,
    data: ${componentDataInterfaceName}<Record<string, any>> & ThisType<T>,
    children: any[]
  ): any
}`;
    });
    return src;
}
//# sourceMappingURL=preprocess.js.map