"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExternalTagProvider = exports.getDependencyTagProvider = exports.getWorkspaceTagProvider = exports.gridsomeTagProvider = exports.bootstrapTagProvider = exports.onsenTagProvider = exports.elementTagProvider = void 0;
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const lodash_1 = require("lodash");
const common_1 = require("./common");
const elementTags = require("element-helper-json/element-tags.json");
const elementAttributes = require("element-helper-json/element-attributes.json");
const onsenTags = require("vue-onsenui-helper-json/vue-onsenui-tags.json");
const onsenAttributes = require("vue-onsenui-helper-json/vue-onsenui-attributes.json");
const bootstrapTags = require("bootstrap-vue-helper-json/tags.json");
const bootstrapAttributes = require("bootstrap-vue-helper-json/attributes.json");
const gridsomeTags = require("gridsome-helper-json/gridsome-tags.json");
const gridsomeAttributes = require("gridsome-helper-json/gridsome-attributes.json");
exports.elementTagProvider = getExternalTagProvider('element', elementTags, elementAttributes);
exports.onsenTagProvider = getExternalTagProvider('onsen', onsenTags, onsenAttributes);
exports.bootstrapTagProvider = getExternalTagProvider('bootstrap', bootstrapTags, bootstrapAttributes);
exports.gridsomeTagProvider = getExternalTagProvider('gridsome', gridsomeTags, gridsomeAttributes);
/**
 * Get tag providers specified in workspace root's packaage.json
 */
function getWorkspaceTagProvider(workspacePath, rootPkgJson) {
    if (!rootPkgJson.vetur) {
        return null;
    }
    const tagsPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, rootPkgJson.vetur.tags);
    const attrsPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, rootPkgJson.vetur.attributes);
    try {
        if (tagsPath && attrsPath) {
            const tagsJson = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
            const attrsJson = JSON.parse(fs.readFileSync(attrsPath, 'utf-8'));
            return getExternalTagProvider('__vetur-workspace', tagsJson, attrsJson);
        }
        return null;
    }
    catch (err) {
        return null;
    }
}
exports.getWorkspaceTagProvider = getWorkspaceTagProvider;
/**
 * Get tag providers specified in packaage.json's `vetur` key
 */
function getDependencyTagProvider(workspacePath, depPkgJson) {
    if (!depPkgJson.vetur) {
        return null;
    }
    const tagsPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, path.join('node_modules/', depPkgJson.name, depPkgJson.vetur.tags));
    const attrsPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, path.join('node_modules/', depPkgJson.name, depPkgJson.vetur.attributes));
    try {
        if (tagsPath && attrsPath) {
            const tagsJson = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
            const attrsJson = JSON.parse(fs.readFileSync(attrsPath, 'utf-8'));
            return getExternalTagProvider(depPkgJson.name, tagsJson, attrsJson);
        }
        return null;
    }
    catch (err) {
        return null;
    }
}
exports.getDependencyTagProvider = getDependencyTagProvider;
function getExternalTagProvider(id, tags, attributes) {
    function findAttributeDetail(tag, attr) {
        return (attributes[attr] ||
            attributes[`${tag}/${attr}`] ||
            attributes[`${tag.toLowerCase}/${attr}`] ||
            attributes[`${lodash_1.kebabCase(tag)}/${attr}`]);
    }
    return {
        getId: () => id,
        priority: common_1.Priority.Library,
        collectTags(collector) {
            for (const tagName in tags) {
                collector(tagName, tags[tagName].description || '');
            }
        },
        collectAttributes(tag, collector) {
            var _a;
            const attrs = (_a = common_1.getSameTagInSet(tags, tag)) === null || _a === void 0 ? void 0 : _a.attributes;
            if (!attrs) {
                return;
            }
            for (const attr of attrs) {
                const detail = findAttributeDetail(tag, attr);
                if ((detail === null || detail === void 0 ? void 0 : detail.type) === 'boolean') {
                    collector(attr, 'v', (detail && detail.description) || '');
                }
                else if ((detail === null || detail === void 0 ? void 0 : detail.type) === 'event') {
                    collector(attr, 'event', (detail && detail.description) || '');
                }
                else {
                    collector(attr, undefined, (detail && detail.description) || '');
                }
            }
        },
        collectValues(tag, attr, collector) {
            var _a;
            const attrs = (_a = common_1.getSameTagInSet(tags, tag)) === null || _a === void 0 ? void 0 : _a.attributes;
            if (!attrs || attrs.indexOf(attr) < 0) {
                return;
            }
            const detail = findAttributeDetail(tag, attr);
            if (!detail || !detail.options) {
                return;
            }
            for (const option of detail.options) {
                collector(option);
            }
        }
    };
}
exports.getExternalTagProvider = getExternalTagProvider;
//# sourceMappingURL=externalTagProviders.js.map