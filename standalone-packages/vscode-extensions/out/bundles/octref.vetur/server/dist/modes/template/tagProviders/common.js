"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
    constructor(label, attributes = []) {
        this.label = label;
        this.attributes = attributes;
    }
}
exports.HTMLTagSpecification = HTMLTagSpecification;
function collectTagsDefault(collector, tagSet) {
    for (const tag in tagSet) {
        collector(tag, tagSet[tag].label);
    }
}
exports.collectTagsDefault = collectTagsDefault;
function collectAttributesDefault(tag, collector, tagSet, globalAttributes) {
    if (tag) {
        const tags = tagSet[tag];
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
        const tags = tagSet[tag];
        if (tags) {
            const attributes = tags.attributes;
            if (attributes) {
                processAttributes(attributes);
            }
        }
    }
    processAttributes(globalAttributes);
    // TODO: add custom tag support
    // if (customTags) {
    //   var customTagAttributes = customTags[tag];
    //   if (customTagAttributes) {
    //     processAttributes(customTagAttributes);
    //   }
    // }
}
exports.collectValuesDefault = collectValuesDefault;
function genAttribute(label, type, documentation) {
    return { label, type, documentation };
}
exports.genAttribute = genAttribute;
//# sourceMappingURL=common.js.map