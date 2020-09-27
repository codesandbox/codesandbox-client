"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComponentInfoTagProvider = void 0;
const common_1 = require("./common");
function getComponentInfoTagProvider(childComponents) {
    const tagSet = {};
    for (const cc of childComponents) {
        const props = [];
        if (cc.info && cc.info.componentInfo.props) {
            cc.info.componentInfo.props.forEach(p => {
                props.push(common_1.genAttribute(`:${p.name}`, undefined, { kind: 'markdown', value: p.documentation || '' }));
            });
        }
        tagSet[cc.name] = new common_1.HTMLTagSpecification({
            kind: 'markdown',
            value: cc.documentation || ''
        }, props);
    }
    return {
        getId: () => 'component',
        priority: common_1.Priority.UserCode,
        collectTags: collector => common_1.collectTagsDefault(collector, tagSet),
        collectAttributes: (tag, collector) => {
            common_1.collectAttributesDefault(tag, collector, tagSet, []);
        },
        collectValues: (tag, attribute, collector) => {
            common_1.collectValuesDefault(tag, attribute, collector, tagSet, [], {});
        }
    };
}
exports.getComponentInfoTagProvider = getComponentInfoTagProvider;
//# sourceMappingURL=componentInfoTagProvider.js.map