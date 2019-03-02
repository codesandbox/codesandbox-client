"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("./common");
function getComponentTags(components) {
    const tags = {};
    for (const comp of components) {
        const compName = comp.name;
        const props = comp.props ? comp.props.map(s => common_1.genAttribute(s.name, undefined, s.doc)) : [];
        tags[compName] = new common_1.HTMLTagSpecification('', props);
    }
    return {
        getId: () => 'component',
        priority: common_1.Priority.UserCode,
        collectTags: collector => common_1.collectTagsDefault(collector, tags),
        collectAttributes: (tag, collector) => {
            common_1.collectAttributesDefault(tag, collector, tags, []);
        },
        collectValues: (tag, attribute, collector) => {
            common_1.collectValuesDefault(tag, attribute, collector, tags, [], {});
        }
    };
}
exports.getComponentTags = getComponentTags;
//# sourceMappingURL=componentTags.js.map