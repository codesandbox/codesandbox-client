"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLanguageRangesOfType = exports.getSingleTypeDocument = exports.getSingleLanguageDocument = exports.getVueDocumentRegions = void 0;
const vscode_languageserver_types_1 = require("vscode-languageserver-types");
const vueDocumentRegionParser_1 = require("./vueDocumentRegionParser");
const defaultLanguageIdForBlockTypes = {
    template: 'vue-html',
    script: 'javascript',
    style: 'css'
};
function getVueDocumentRegions(document) {
    const { regions, importedScripts } = vueDocumentRegionParser_1.parseVueDocumentRegions(document);
    return {
        getSingleLanguageDocument: (languageId) => getSingleLanguageDocument(document, regions, languageId),
        getSingleTypeDocument: (type) => getSingleTypeDocument(document, regions, type),
        getLanguageRangesOfType: (type) => getLanguageRangesOfType(document, regions, type),
        getAllLanguageRanges: () => getAllLanguageRanges(document, regions),
        getLanguageAtPosition: (position) => getLanguageAtPosition(document, regions, position),
        getImportedScripts: () => importedScripts
    };
}
exports.getVueDocumentRegions = getVueDocumentRegions;
function getAllLanguageRanges(document, regions) {
    return regions.map(r => {
        return {
            languageId: r.languageId,
            start: document.positionAt(r.start),
            end: document.positionAt(r.end)
        };
    });
}
function getLanguageAtPosition(document, regions, position) {
    const offset = document.offsetAt(position);
    for (const region of regions) {
        if (region.start <= offset) {
            if (offset <= region.end) {
                return region.languageId;
            }
        }
        else {
            break;
        }
    }
    return 'vue';
}
function getSingleLanguageDocument(document, regions, languageId) {
    const oldContent = document.getText();
    let newContent = oldContent
        .split('\n')
        .map(line => ' '.repeat(line.length))
        .join('\n');
    for (const r of regions) {
        if (r.languageId === languageId) {
            newContent = newContent.slice(0, r.start) + oldContent.slice(r.start, r.end) + newContent.slice(r.end);
        }
    }
    return vscode_languageserver_types_1.TextDocument.create(document.uri, languageId, document.version, newContent);
}
exports.getSingleLanguageDocument = getSingleLanguageDocument;
function getSingleTypeDocument(document, regions, type) {
    const oldContent = document.getText();
    let newContent = oldContent
        .split('\n')
        .map(line => ' '.repeat(line.length))
        .join('\n');
    let langId = defaultLanguageIdForBlockTypes[type];
    for (const r of regions) {
        if (r.type === type) {
            newContent = newContent.slice(0, r.start) + oldContent.slice(r.start, r.end) + newContent.slice(r.end);
            langId = r.languageId;
        }
    }
    if (type === 'script' && newContent.trim().length === 0) {
        newContent = 'export default {};';
    }
    return vscode_languageserver_types_1.TextDocument.create(document.uri, langId, document.version, newContent);
}
exports.getSingleTypeDocument = getSingleTypeDocument;
function getLanguageRangesOfType(document, regions, type) {
    const result = [];
    for (const r of regions) {
        if (r.type === type) {
            result.push({
                start: document.positionAt(r.start),
                end: document.positionAt(r.end),
                languageId: r.languageId
            });
        }
    }
    return result;
}
exports.getLanguageRangesOfType = getLanguageRangesOfType;
//# sourceMappingURL=embeddedSupport.js.map