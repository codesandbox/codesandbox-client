"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ts = require("typescript");
const fs = require("fs");
const path = require("path");
const common_1 = require("./common");
const elementTags = require("element-helper-json/element-tags.json");
const elementAttributes = require("element-helper-json/element-attributes.json");
const onsenTags = require("vue-onsenui-helper-json/vue-onsenui-tags.json");
const onsenAttributes = require("vue-onsenui-helper-json/vue-onsenui-attributes.json");
const bootstrapTags = require("bootstrap-vue-helper-json/tags.json");
const bootstrapAttributes = require("bootstrap-vue-helper-json/attributes.json");
const buefyTags = require("buefy-helper-json/tags.json");
const buefyAttributes = require("buefy-helper-json/attributes.json");
const vuetifyTags = require("vuetify-helper-json/tags.json");
const vuetifyAttributes = require("vuetify-helper-json/attributes.json");
exports.elementTagProvider = getExternalTagProvider('element', elementTags, elementAttributes);
exports.onsenTagProvider = getExternalTagProvider('onsen', onsenTags, onsenAttributes);
exports.bootstrapTagProvider = getExternalTagProvider('bootstrap', bootstrapTags, bootstrapAttributes);
exports.buefyTagProvider = getExternalTagProvider('buefy', buefyTags, buefyAttributes);
exports.vuetifyTagProvider = getExternalTagProvider('vuetify', vuetifyTags, vuetifyAttributes);
function getRuntimeTagProvider(workspacePath, pkg) {
    if (!pkg.vetur) {
        return null;
    }
    const tagsPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, path.join('node_modules/', pkg.name, pkg.vetur.tags));
    const attrsPath = ts.findConfigFile(workspacePath, ts.sys.fileExists, path.join('node_modules/', pkg.name, pkg.vetur.attributes));
    try {
        if (tagsPath && attrsPath) {
            const tagsJson = JSON.parse(fs.readFileSync(tagsPath, 'utf-8'));
            const attrsJson = JSON.parse(fs.readFileSync(attrsPath, 'utf-8'));
            return getExternalTagProvider(pkg.name, tagsJson, attrsJson);
        }
        return null;
    }
    catch (err) {
        return null;
    }
}
exports.getRuntimeTagProvider = getRuntimeTagProvider;
function getExternalTagProvider(id, tags, attributes) {
    function findAttributeDetail(tag, attr) {
        return attributes[attr] || attributes[tag + '/' + attr];
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
            if (!tags[tag]) {
                return;
            }
            const attrs = tags[tag].attributes;
            if (!attrs) {
                return;
            }
            for (const attr of attrs) {
                const detail = findAttributeDetail(tag, attr);
                collector(attr, undefined, (detail && detail.description) || '');
            }
        },
        collectValues(tag, attr, collector) {
            if (!tags[tag]) {
                return;
            }
            const attrs = tags[tag].attributes;
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