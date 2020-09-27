"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRouterTagProvider = void 0;
/* tslint:disable:max-line-length */
const common_1 = require("./common");
const routerTags = {
    'router-link': new common_1.HTMLTagSpecification('Link to navigate user. The target location is specified with the to prop.\n\n[API Reference](https://router.vuejs.org/api/#router-link)', [
        common_1.genAttribute('to', undefined, 'The target route of the link. It can be either a string or a location descriptor object.\n\n[API Reference](https://router.vuejs.org/api/#to)'),
        common_1.genAttribute('replace', undefined, 'Setting replace prop will call `router.replace()` instead of `router.push()` when clicked, so the navigation will not leave a history record.\n\n[API Reference](https://router.vuejs.org/api/#replace)'),
        common_1.genAttribute('append', 'v', 'Setting append prop always appends the relative path to the current path. For example, assuming we are navigating from /a to a relative link b, without append we will end up at /b, but with append we will end up at /a/b.\n\n[API Reference](https://router.vuejs.org/api/#append)'),
        common_1.genAttribute('tag', undefined, 'Specify which tag to render to, and it will still listen to click events for navigation.\n\n[API Reference](https://router.vuejs.org/api/#tag)'),
        common_1.genAttribute('active-class', undefined, 'Configure the active CSS class applied when the link is active.\n\n[API Reference](https://router.vuejs.org/api/#active-class)'),
        common_1.genAttribute('exact', 'v', 'Force the link into "exact match mode".\n\n[API Reference](https://router.vuejs.org/api/#exact)'),
        common_1.genAttribute('event', undefined, 'Specify the event(s) that can trigger the link navigation.\n\n[API Reference](https://router.vuejs.org/api/#event)'),
        common_1.genAttribute('exact-active-class', undefined, 'Configure the active CSS class applied when the link is active with exact match.\n\n[API Reference](https://router.vuejs.org/api/#exact-active-class)'),
        common_1.genAttribute('aria-current-value', 'ariaCurrentType', 'Configure the value of `aria-current` when the link is active with exact match. It must be one of the [allowed values for `aria-current`](https://www.w3.org/TR/wai-aria-1.2/#aria-current) in the ARIA spec. In most cases, the default of `page` should be the best fit.\n\n[API Reference](https://router.vuejs.org/api/#aria-current-value)')
    ]),
    'router-view': new common_1.HTMLTagSpecification('A functional component that renders the matched component for the given path. Components rendered in <router-view> can also contain its own <router-view>, which will render components for nested paths.\n\n\n\n[API Reference](https://router.vuejs.org/api/#router-link)', [
        common_1.genAttribute('name', undefined, "When a `<router-view>` has a name, it will render the component with the corresponding name in the matched route record's components option.\n\n[API Reference](https://router.vuejs.org/api/#to)")
    ])
};
const valueSets = {
    ariaCurrentType: ['page', 'step', 'location', 'date', 'time']
};
function getRouterTagProvider() {
    return {
        getId: () => 'vue-router',
        priority: common_1.Priority.Framework,
        collectTags: collector => common_1.collectTagsDefault(collector, routerTags),
        collectAttributes: (tag, collector) => {
            common_1.collectAttributesDefault(tag, collector, routerTags, []);
        },
        collectValues: (tag, attribute, collector) => {
            common_1.collectValuesDefault(tag, attribute, collector, routerTags, [], valueSets);
        }
    };
}
exports.getRouterTagProvider = getRouterTagProvider;
//# sourceMappingURL=routerTags.js.map