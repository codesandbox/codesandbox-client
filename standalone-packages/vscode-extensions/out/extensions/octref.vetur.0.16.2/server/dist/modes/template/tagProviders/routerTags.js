"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
const common_1 = require("./common");
const u = undefined;
const routerTags = {
    'router-link': new common_1.HTMLTagSpecification('Link to navigate user. The target location is specified with the to prop.', [
        common_1.genAttribute('to', u, 'The target route of the link. It can be either a string or a location descriptor object.'),
        common_1.genAttribute('replace', u, 'Setting replace prop will call router.replace() instead of router.push() when clicked, so the navigation will not leave a history record.'),
        common_1.genAttribute('append', u, 'Setting append prop always appends the relative path to the current path. For example, assuming we are navigating from /a to a relative link b, without append we will end up at /b, but with append we will end up at /a/b.'),
        common_1.genAttribute('tag', u, 'Specify which tag to render to, and it will still listen to click events for navigation.'),
        common_1.genAttribute('active-class', u, 'Configure the active CSS class applied when the link is active.'),
        common_1.genAttribute('exact', u, 'Force the link into "exact match mode".'),
        common_1.genAttribute('event', u, 'Specify the event(s) that can trigger the link navigation.'),
        common_1.genAttribute('exact-active-class', u, 'Configure the active CSS class applied when the link is active with exact match.')
    ]),
    'router-view': new common_1.HTMLTagSpecification('A functional component that renders the matched component for the given path. Components rendered in <router-view> can also contain its own <router-view>, which will render components for nested paths.', [
        common_1.genAttribute('name', u, "When a <router-view> has a name, it will render the component with the corresponding name in the matched route record's components option")
    ])
};
function getRouterTagProvider() {
    return {
        getId: () => 'router',
        priority: common_1.Priority.Framework,
        collectTags: collector => common_1.collectTagsDefault(collector, routerTags),
        collectAttributes: (tag, collector) => {
            common_1.collectAttributesDefault(tag, collector, routerTags, []);
        },
        collectValues: (tag, attribute, collector) => {
            common_1.collectValuesDefault(tag, attribute, collector, routerTags, [], {});
        }
    };
}
exports.getRouterTagProvider = getRouterTagProvider;
//# sourceMappingURL=routerTags.js.map