"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:max-line-length */
const common_1 = require("./common");
const u = undefined;
const vueDirectives = [
    common_1.genAttribute('v-text', u, 'Updates the element’s `textContent`.'),
    common_1.genAttribute('v-html', u, 'Updates the element’s `innerHTML`. XSS prone.'),
    common_1.genAttribute('v-show', u, 'Toggle’s the element’s `display` CSS property based on the truthy-ness of the expression value.'),
    common_1.genAttribute('v-if', u, 'Conditionally renders the element based on the truthy-ness of the expression value.'),
    common_1.genAttribute('v-else', 'v', 'Denotes the “else block” for `v-if` or a `v-if`/`v-else-if` chain.'),
    common_1.genAttribute('v-else-if', u, 'Denotes the “else if block” for `v-if`. Can be chained.'),
    common_1.genAttribute('v-for', u, 'Renders the element or template block multiple times based on the source data.'),
    common_1.genAttribute('v-on', u, 'Attaches an event listener to the element.'),
    common_1.genAttribute('v-bind', u, 'Dynamically binds one or more attributes, or a component prop to an expression.'),
    common_1.genAttribute('v-model', u, 'Creates a two-way binding on a form input element or a component.'),
    common_1.genAttribute('v-pre', 'v', 'Skips compilation for this element and all its children.'),
    common_1.genAttribute('v-cloak', 'v', 'Indicates Vue instance for this element has NOT finished compilation.'),
    common_1.genAttribute('v-once', 'v', 'Render the element and component once only.'),
    common_1.genAttribute('key', u, 'Hint at VNodes identity for VDom diffing, e.g. list rendering'),
    common_1.genAttribute('ref', u, 'Register a reference to an element or a child component.'),
    common_1.genAttribute('slot', u, 'Used on content inserted into child components to indicate which named slot the content belongs to.'),
    common_1.genAttribute('slot-scope', u, 'the name of a temporary variable that holds the props object passed from the child')
];
const transitionProps = [
    common_1.genAttribute('name', u, 'Used to automatically generate transition CSS class names. Default: "v"'),
    common_1.genAttribute('appear', 'b', 'Whether to apply transition on initial render. Default: false'),
    common_1.genAttribute('css', 'b', 'Whether to apply CSS transition classes. Defaults: true. If set to false, will only trigger JavaScript hooks registered via component events.'),
    common_1.genAttribute('type', 'transType', 'The event, "transition" or "animation", to determine end timing. Default: the type that has a longer duration.'),
    common_1.genAttribute('mode', 'transMode', 'Controls the timing sequence of leaving/entering transitions. Available modes are "out-in" and "in-out"; Defaults to simultaneous.')
].concat([
    'enter-class',
    'leave-class',
    'appear-class',
    'enter-to-class',
    'leave-to-class',
    'appear-to-class',
    'enter-active-class',
    'leave-active-class',
    'appear-active-class'
].map(t => common_1.genAttribute(t)));
const vueTags = {
    component: new common_1.HTMLTagSpecification('A meta component for rendering dynamic components. The actual component to render is determined by the `is` prop.', [
        common_1.genAttribute('is', u, 'the actual component to render'),
        common_1.genAttribute('inline-template', 'v', 'treat inner content as its template rather than distributed content')
    ]),
    transition: new common_1.HTMLTagSpecification('<transition> serves as transition effects for single element/component. It applies the transition behavior to the wrapped content inside.', transitionProps),
    'transition-group': new common_1.HTMLTagSpecification('transition group serves as transition effects for multiple elements/components. It renders a <span> by default and can render user specified element via `tag` attribute.', transitionProps.concat(common_1.genAttribute('tag'), common_1.genAttribute('move-class'))),
    'keep-alive': new common_1.HTMLTagSpecification('When wrapped around a dynamic component, <keep-alive> caches the inactive component instances without destroying them.', ['include', 'exclude'].map(t => common_1.genAttribute(t))),
    slot: new common_1.HTMLTagSpecification('<slot> serve as content distribution outlets in component templates. <slot> itself will be replaced.', [common_1.genAttribute('name', u, 'Used for named slot')]),
    template: new common_1.HTMLTagSpecification('The template element is used to declare fragments of HTML that can be cloned and inserted in the document by script.', [
        common_1.genAttribute('scope', u, '(deprecated) a temporary variable that holds the props object passed from the child'),
        common_1.genAttribute('slot', u, 'the name of scoped slot')
    ])
};
const valueSets = {
    transMode: ['out-in', 'in-out'],
    transType: ['transition', 'animation'],
    b: ['true', 'false']
};
function getVueTagProvider() {
    return {
        getId: () => 'vue',
        priority: common_1.Priority.Framework,
        collectTags: collector => common_1.collectTagsDefault(collector, vueTags),
        collectAttributes: (tag, collector) => {
            common_1.collectAttributesDefault(tag, collector, vueTags, vueDirectives);
        },
        collectValues: (tag, attribute, collector) => {
            common_1.collectValuesDefault(tag, attribute, collector, vueTags, vueDirectives, valueSets);
        }
    };
}
exports.getVueTagProvider = getVueTagProvider;
//# sourceMappingURL=vueTags.js.map