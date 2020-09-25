"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.genAttribute = exports.collectValuesDefault = exports.collectAttributesDefault = exports.collectTagsDefault = exports.getSameTagInSet = exports.HTMLTagSpecification = exports.Priority = void 0;
const lodash_1 = require("lodash");
// Note: cannot items more than 10 for lexical order
// smaller enum value means higher priority
var Priority;
(function (Priority) {
    Priority[Priority["UserCode"] = 0] = "UserCode";
    Priority[Priority["Library"] = 1] = "Library";
    Priority[Priority["Framework"] = 2] = "Framework";
    Priority[Priority["Platform"] = 3] = "Platform";
})(Priority = exports.Priority || (exports.Priority = {}));
class HTMLTagSpecification {
    constructor(documentation, attributes = []) {
        this.documentation = documentation;
        this.attributes = attributes;
    }
}
exports.HTMLTagSpecification = HTMLTagSpecification;
function getSameTagInSet(tagSet, tag) {
    var _a, _b;
    return (_b = (_a = tagSet[tag]) !== null && _a !== void 0 ? _a : tagSet[tag.toLowerCase()]) !== null && _b !== void 0 ? _b : tagSet[lodash_1.kebabCase(tag)];
}
exports.getSameTagInSet = getSameTagInSet;
function collectTagsDefault(collector, tagSet) {
    for (const tag in tagSet) {
        collector(tag, tagSet[tag].documentation);
    }
}
exports.collectTagsDefault = collectTagsDefault;
function collectAttributesDefault(tag, collector, tagSet, globalAttributes) {
    if (tag) {
        const tags = getSameTagInSet(tagSet, tag);
        if (tags) {
            const attributes = tags.attributes;
            for (const attr of attributes) {
                collector(attr.label, attr.type, attr.documentation);
            }
        }
    }
    globalAttributes.forEach(attr => {
        collector(attr.label, attr.type, attr.documentation);
    });
}
exports.collectAttributesDefault = collectAttributesDefault;
function collectValuesDefault(tag, attribute, collector, tagSet, globalAttributes, valueSets) {
    function processAttributes(attributes) {
        for (const attr of attributes) {
            const label = attr.label;
            if (label !== attribute || !attr.type) {
                continue;
            }
            const typeInfo = attr.type;
            if (typeInfo === 'v') {
                collector(attribute);
            }
            else {
                const values = valueSets[typeInfo];
                if (values) {
                    values.forEach(collector);
                }
            }
        }
    }
    if (tag) {
        const tags = getSameTagInSet(tagSet, tag);
        if (tags) {
            const attributes = tags.attributes;
            if (attributes) {
                processAttributes(attributes);
            }
        }
    }
    processAttributes(globalAttributes);
}
exports.collectValuesDefault = collectValuesDefault;
function genAttribute(label, type, documentation) {
    return { label, type, documentation };
}
exports.genAttribute = genAttribute;
//# sourceMappingURL=common.js.map