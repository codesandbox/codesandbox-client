"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTemplateTransformFunctions = exports.globalScope = exports.componentDataName = exports.iterationHelperName = exports.componentHelperName = exports.renderHelperName = void 0;
const lodash_1 = require("lodash");
const walkExpression_1 = require("./walkExpression");
exports.renderHelperName = '__vlsRenderHelper';
exports.componentHelperName = '__vlsComponentHelper';
exports.iterationHelperName = '__vlsIterationHelper';
exports.componentDataName = '__vlsComponentData';
/**
 * Allowed global variables in templates.
 * Borrowed from: https://github.com/vuejs/vue/blob/dev/src/core/instance/proxy.js
 */
exports.globalScope = ('Infinity,undefined,NaN,isFinite,isNaN,' +
    'parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,' +
    'Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,' +
    'require').split(',');
const vOnScope = ['$event', 'arguments'];
/**
 * @param ts Loaded TS dependency
 * @param childComponentNamesInSnakeCase If `VElement`'s name matches one of the child components'
 * name, generate expression with `${componentHelperName}__${name}`, which will enforce type-check
 * on props
 */
function getTemplateTransformFunctions(ts, childComponentNamesInSnakeCase) {
    return {
        transformTemplate,
        parseExpression
    };
    /**
     * Transform template AST to TypeScript AST.
     * Note: The returned TS AST is not compatible with
     * the regular Vue render function and does not work on runtime
     * because we just need type information for the template.
     * Each TypeScript node should be set a range because
     * the compiler may clash or do incorrect type inference
     * when it has an invalid range.
     */
    function transformTemplate(program, code) {
        const template = program.templateBody;
        if (!template) {
            return [];
        }
        return transformChildren(template.children, code, exports.globalScope);
    }
    /**
     * Transform an HTML to TypeScript AST.
     * It will be a call expression like Vue's $createElement.
     * e.g.
     * __vlsComponentHelper('div', { props: { title: this.foo } }, [ ...children... ]);
     */
    function transformElement(node, code, scope) {
        /**
         * `vModel`      -> need info from other components to do type check
         * `v-bind`      -> do this later
         * `v-bind:[foo] -> don't do type-check. do make `[]` an interpolation area
         */
        const hasUnhandledAttributes = node.startTag.attributes.some(attr => {
            return isVModel(attr) || (isVBind(attr) && !isVBindShorthand(attr)) || isVBindWithDynamicAttributeName(attr);
        });
        const identifier = !hasUnhandledAttributes &&
            childComponentNamesInSnakeCase &&
            childComponentNamesInSnakeCase.indexOf(lodash_1.snakeCase(node.rawName)) !== -1
            ? ts.createIdentifier(exports.componentHelperName + '__' + lodash_1.snakeCase(node.rawName))
            : ts.createIdentifier(exports.componentHelperName);
        return ts.createCall(identifier, undefined, [
            // Pass this value to propagate ThisType in listener handlers
            ts.createIdentifier('this'),
            // Element / Component name
            ts.createLiteral(node.name),
            // Attributes / Directives
            transformAttributes(node, node.startTag.attributes, code, scope),
            // Children
            ts.createArrayLiteral(transformChildren(node.children, code, scope))
        ]);
    }
    function transformAttributes(node, attrs, code, scope) {
        const data = {
            props: [],
            on: [],
            directives: []
        };
        attrs.forEach(attr => {
            // Normal attributes
            // e.g. title="title"
            if (isVAttribute(attr)) {
                const name = attr.key.name;
                // Skip style and class because there may be v-bind for the same attribute which
                // occurs duplicate property name error.
                // Since native attribute value is not JS expression, we don't have to check it.
                if (name !== 'class' && name !== 'style') {
                    data.props.push(transformNativeAttribute(attr));
                }
                return;
            }
            // v-bind directives
            // e.g. :class="{ selected: foo }"
            if (isVBind(attr)) {
                data.props.push(transformVBind(attr, code, scope));
                return;
            }
            // v-on directives
            // e.g. @click="onClick"
            if (isVOn(attr)) {
                data.on.push(transformVOn(attr, code, scope));
                return;
            }
            // Skip v-slot, v-for and v-if family directive (handled in `transformChildren`)
            if (isVSlot(attr) || isVFor(attr) || isVIf(attr) || isVElseIf(attr) || isVElse(attr)) {
                return;
            }
            // Other directives
            const exp = transformDirective(attr, code, scope);
            if (exp) {
                data.directives.push(...exp);
            }
        });
        // Fold all AST into VNodeData-like object
        // example output:
        // {
        //   props: { class: 'title' },
        //   on: { click: __vlsListenerHelper(this, function($event) { this.onClick($event) } }
        // }
        const propsAssignment = ts.createPropertyAssignment('props', ts.createObjectLiteral(data.props));
        ts.setSourceMapRange(propsAssignment.name, {
            pos: node.startTag.range[0] + '<'.length,
            end: node.startTag.range[0] + '<'.length + node.rawName.length
        });
        return ts.createObjectLiteral([
            propsAssignment,
            ts.createPropertyAssignment('on', ts.createObjectLiteral(data.on)),
            ts.createPropertyAssignment('directives', ts.createArrayLiteral(data.directives))
        ]);
    }
    function transformNativeAttribute(attr) {
        return ts.createPropertyAssignment(ts.createStringLiteral(attr.key.name), attr.value ? ts.createLiteral(attr.value.value) : ts.createLiteral(true));
    }
    function transformVBind(vBind, code, scope) {
        const exp = vBind.value ? transformExpressionContainer(vBind.value, code, scope) : ts.createLiteral(true);
        return directiveToObjectElement(vBind, exp, code, scope);
    }
    function transformVOn(vOn, code, scope) {
        let exp;
        if (vOn.value) {
            if (!vOn.key.argument) {
                // e.g.
                //   v-on="$listeners"
                // Annotate the expression with `any` because we do not expect type error
                // with bridge type and it. Currently, bridge type should only be used
                // for inferring `$event` type.
                exp = ts.createAsExpression(transformExpressionContainer(vOn.value, code, scope), ts.createKeywordTypeNode(ts.SyntaxKind.AnyKeyword));
            }
            else {
                // e.g.
                //   @click="onClick"
                //   @click="onClick($event, 'test')"
                // value.expression can be ESLintExpression (e.g. ArrowFunctionExpression)
                const vOnExp = vOn.value.expression;
                const newScope = scope.concat(vOnScope);
                const statements = !vOnExp || vOnExp.type !== 'VOnExpression'
                    ? [ts.createExpressionStatement(transformExpressionContainer(vOn.value, code, newScope))]
                    : vOnExp.body.map(st => transformStatement(st, code, newScope));
                exp = ts.createFunctionExpression(undefined, undefined, undefined, undefined, [ts.createParameter(undefined, undefined, undefined, '$event')], undefined, ts.createBlock(statements));
            }
        }
        else {
            // There are no statement in v-on value
            exp = ts.createFunctionExpression(undefined, undefined, undefined, undefined, undefined, undefined, ts.createBlock([]));
        }
        return directiveToObjectElement(vOn, exp, code, scope);
    }
    /**
     * To transform v-bind and v-on directive
     */
    function directiveToObjectElement(dir, dirExp, code, scope) {
        const name = dir.key.argument;
        if (name) {
            if (name.type === 'VIdentifier') {
                // Attribute name is specified
                // e.g. v-bind:value="foo"
                const propNameNode = ts.setSourceMapRange(ts.createStringLiteral(lodash_1.kebabCase(name.rawName)), {
                    pos: name.range[0],
                    end: name.range[1]
                });
                return ts.createPropertyAssignment(propNameNode, dirExp);
            }
            else {
                // Attribute name is dynamic
                // e.g. v-bind:[value]="foo"
                const propertyName = ts.createComputedPropertyName(transformExpressionContainer(name, code, scope));
                return ts.createPropertyAssignment(propertyName, dirExp);
            }
        }
        else {
            // Attribute name is omitted
            // e.g. v-bind="{ value: foo }"
            return ts.createSpreadAssignment(dirExp);
        }
    }
    /**
     * Return directive expression. May include dynamic argument expression.
     */
    function transformDirective(dir, code, scope) {
        const res = [];
        if (dir.key.argument && dir.key.argument.type === 'VExpressionContainer') {
            res.push(transformExpressionContainer(dir.key.argument, code, scope));
        }
        if (dir.value) {
            res.push(transformExpressionContainer(dir.value, code, scope));
        }
        return res;
    }
    function transformChildren(children, code, originalScope) {
        // Pre-transform child nodes to make further transformation easier
        function preTransform(children) {
            const queue = children.slice();
            function element(el, attrs) {
                const vSlot = attrs.find(isVSlot);
                if (vSlot) {
                    const index = attrs.indexOf(vSlot);
                    const scope = el.variables.filter(v => v.kind === 'scope').map(v => v.id.name);
                    return {
                        type: 'v-slot',
                        vSlot,
                        data: element(el, [...attrs.slice(0, index), ...attrs.slice(index + 1)]),
                        scope
                    };
                }
                // v-for has higher priority than v-if
                // https://vuejs.org/v2/guide/list.html#v-for-with-v-if
                const vFor = attrs.find(isVFor);
                if (vFor) {
                    const index = attrs.indexOf(vFor);
                    const scope = el.variables.filter(v => v.kind === 'v-for').map(v => v.id.name);
                    return {
                        type: 'v-for',
                        vFor,
                        data: element(el, [...attrs.slice(0, index), ...attrs.slice(index + 1)]),
                        scope
                    };
                }
                const vIf = attrs.find(isVIf);
                if (vIf) {
                    const index = attrs.indexOf(vIf);
                    return {
                        type: 'v-if-family',
                        directive: vIf,
                        data: element(el, [...attrs.slice(0, index), ...attrs.slice(index + 1)]),
                        next: followVIf()
                    };
                }
                return {
                    type: 'node',
                    data: el
                };
            }
            function followVIf() {
                const el = queue[0];
                if (!el || el.type !== 'VElement') {
                    return undefined;
                }
                const attrs = el.startTag.attributes;
                const directive = attrs.find(isVElseIf) || attrs.find(isVElse);
                if (!directive) {
                    return undefined;
                }
                queue.shift();
                return {
                    type: 'v-if-family',
                    directive,
                    data: element(el, attrs),
                    next: followVIf()
                };
            }
            function loop(acc) {
                const target = queue.shift();
                if (!target) {
                    return acc;
                }
                if (target.type !== 'VElement') {
                    return loop(acc.concat({
                        type: 'node',
                        data: target
                    }));
                }
                return loop(acc.concat(element(target, target.startTag.attributes)));
            }
            return loop([]);
        }
        function mainTransform(children) {
            function genericTransform(child, scope) {
                switch (child.type) {
                    case 'v-for':
                        return vForTransform(child, scope);
                    case 'v-if-family':
                        return vIfFamilyTransform(child, scope);
                    case 'v-slot':
                        return vSlotTransform(child, scope);
                    case 'node':
                        return nodeTransform(child, scope);
                }
            }
            function vIfFamilyTransform(vIfFamily, scope) {
                const dir = vIfFamily.directive;
                const condition = dir.value ? transformExpressionContainer(dir.value, code, scope) : ts.createLiteral(true);
                const next = vIfFamily.next ? vIfFamilyTransform(vIfFamily.next, scope) : ts.createLiteral(true);
                return ts.createConditional(
                // v-if or v-else-if condition
                condition, 
                // element that the v-if family directive belongs to
                genericTransform(vIfFamily.data, scope), 
                // next sibling element of v-if or v-else if any
                next);
            }
            function vForTransform(vForData, scope) {
                const vFor = vForData.vFor;
                if (!vFor.value || !vFor.value.expression) {
                    return genericTransform(vForData.data, scope);
                }
                // Convert v-for directive to the iteration helper
                const exp = vFor.value.expression;
                const newScope = scope.concat(vForData.scope);
                return ts.createCall(ts.createIdentifier(exports.iterationHelperName), undefined, [
                    // Iteration target
                    transformExpression(exp.right, code, scope),
                    // Callback
                    ts.createArrowFunction(undefined, undefined, parseParams(exp.left, code, scope), undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), genericTransform(vForData.data, newScope))
                ]);
            }
            function vSlotTransform(vSlotData, scope) {
                const vSlot = vSlotData.vSlot;
                if (!vSlot.value || !vSlot.value.expression) {
                    return genericTransform(vSlotData.data, scope);
                }
                const exp = vSlot.value.expression;
                const newScope = scope.concat(vSlotData.scope);
                return ts.createArrowFunction(undefined, undefined, parseParams(exp.params, code, scope), undefined, ts.createToken(ts.SyntaxKind.EqualsGreaterThanToken), genericTransform(vSlotData.data, newScope));
            }
            function nodeTransform(nodeData, scope) {
                const child = nodeData.data;
                switch (child.type) {
                    case 'VElement':
                        return transformElement(child, code, scope);
                    case 'VExpressionContainer':
                        return transformExpressionContainer(child, code, scope);
                    case 'VText':
                        return ts.createLiteral(child.value);
                }
            }
            return children.map(child => genericTransform(child, originalScope));
        }
        // Remove whitespace nodes
        const filtered = children.filter(child => {
            return child.type !== 'VText' || child.value.trim() !== '';
        });
        return mainTransform(preTransform(filtered));
    }
    function transformStatement(statement, code, scope) {
        if (statement.type !== 'ExpressionStatement') {
            console.error('Unexpected statement type:', statement.type);
            return ts.createExpressionStatement(ts.createLiteral(''));
        }
        return ts.createExpressionStatement(transformExpression(statement.expression, code, scope));
    }
    function transformFilter(filter, code, scope) {
        const exp = transformExpression(filter.expression, code, scope);
        // Simply convert all filter arguments into array literal because
        // we just want to check their types.
        // Do not care about existence of filters and matching between parameter
        // and argument types because filters will not appear on component type.
        const filterExps = ts.createArrayLiteral(filter.filters.map(f => {
            return ts.createArrayLiteral(f.arguments.map(arg => {
                const exp = arg.type === 'SpreadElement' ? arg.argument : arg;
                return transformExpression(exp, code, scope);
            }));
        }));
        return ts.createBinary(filterExps, ts.SyntaxKind.BarBarToken, exp);
    }
    function transformExpressionContainer(container, code, scope) {
        const exp = container.expression;
        if (exp) {
            if (exp.type === 'VOnExpression' || exp.type === 'VForExpression' || exp.type === 'VSlotScopeExpression') {
                throw new Error(`'${exp.type}' should not be transformed with 'transformExpressionContainer'`);
            }
            if (exp.type === 'VFilterSequenceExpression') {
                return transformFilter(exp, code, scope);
            }
        }
        // Other type of expression should parsed by TypeScript compiler
        const [start, end] = expressionCodeRange(container);
        const expStr = code.slice(start, end);
        return parseExpression(expStr, scope, start);
    }
    function transformExpression(exp, code, scope) {
        const [start, end] = exp.range;
        const expStr = code.slice(start, end);
        return parseExpression(expStr, scope, start);
    }
    function parseExpression(exp, scope, start) {
        // Add parenthesis to deal with object literal expression
        const wrappedExp = '(' + exp + ')';
        const source = ts.createSourceFile('/tmp/parsed.ts', wrappedExp, ts.ScriptTarget.Latest, true);
        const statement = source.statements[0];
        if (!statement || !ts.isExpressionStatement(statement)) {
            console.error('Unexpected statement kind:', statement.kind);
            return ts.createLiteral('');
        }
        const parenthesis = statement.expression;
        // Compensate for the added `(` that adds 1 to each Node's offset
        const offset = start - '('.length;
        return walkExpression_1.walkExpression(ts, parenthesis.expression, createWalkCallback(scope, offset, source));
    }
    function expressionCodeRange(container) {
        const parent = container.parent;
        const offset = parent.type === 'VElement' || parent.type === 'VDocumentFragment'
            ? // Text node interpolation
                // {{ exp }} => 2
                2
            : // Attribute interpolation
                // v-test:[exp] => 1
                // :name="exp" => 1
                1;
        return [container.range[0] + offset, container.range[1] - offset];
    }
    function createWalkCallback(scope, offset, source) {
        return (node, additionalScope) => {
            const thisScope = scope.concat(additionalScope.map(id => id.text));
            const injected = injectThis(node, thisScope, offset, source);
            setSourceMapRange(injected, node, offset, source);
            resetTextRange(injected);
            return injected;
        };
    }
    function parseParams(params, code, scope) {
        const start = params[0].range[0];
        const end = params[params.length - 1].range[1];
        const paramsStr = code.slice(start, end);
        // Wrap parameters with an arrow function to extract them as ts parameter declarations.
        const arrowFnStr = '(' + paramsStr + ') => {}';
        // Decrement the offset since the expression now has the open parenthesis.
        const exp = parseExpression(arrowFnStr, scope, start - 1);
        return exp.parameters;
    }
    function injectThis(exp, scope, start, source) {
        if (ts.isIdentifier(exp)) {
            return scope.indexOf(exp.text) < 0 ? ts.createPropertyAccess(ts.createThis(), exp) : exp;
        }
        if (ts.isObjectLiteralExpression(exp)) {
            const properties = exp.properties.map(p => {
                if (!ts.isShorthandPropertyAssignment(p)) {
                    return p;
                }
                // Divide short hand property to name and initializer and inject `this`
                // We need to walk generated initializer expression.
                const initializer = createWalkCallback(scope, start, source)(p.name, []);
                return ts.createPropertyAssignment(p.name, initializer);
            });
            return ts.createObjectLiteral(properties);
        }
        return exp;
    }
    function setSourceMapRange(exp, range, offset, source) {
        ts.setSourceMapRange(exp, {
            pos: offset + range.getStart(source),
            end: offset + range.getEnd()
        });
        if (ts.isPropertyAccessExpression(exp)) {
            // May be transformed from Identifier by injecting `this`
            const r = ts.isPropertyAccessExpression(range) ? range.name : range;
            ts.setSourceMapRange(exp.name, {
                pos: offset + r.getStart(source),
                end: offset + r.getEnd()
            });
            return;
        }
        if (ts.isArrowFunction(exp)) {
            const walkBinding = (name, range) => {
                ts.setSourceMapRange(name, {
                    pos: offset + range.getStart(source),
                    end: offset + range.getEnd()
                });
                if (ts.isObjectBindingPattern(name) || ts.isArrayBindingPattern(name)) {
                    name.elements.forEach((el, i) => {
                        if (ts.isOmittedExpression(el)) {
                            return;
                        }
                        const elRange = range.elements[i];
                        ts.setSourceMapRange(el, {
                            pos: offset + elRange.getStart(source),
                            end: offset + elRange.getEnd()
                        });
                        walkBinding(el.name, elRange.name);
                    });
                }
            };
            const r = range;
            exp.parameters.forEach((p, i) => {
                const range = r.parameters[i];
                ts.setSourceMapRange(p, {
                    pos: offset + range.getStart(source),
                    end: offset + range.getEnd()
                });
                walkBinding(p.name, range.name);
            });
        }
    }
    /**
     * Because Nodes can have non-virtual positions
     * Set them to synthetic positions so printers could print correctly
     */
    function resetTextRange(exp) {
        if (ts.isObjectLiteralExpression(exp)) {
            exp.properties.forEach((p, i) => {
                if (ts.isPropertyAssignment(p) && !ts.isComputedPropertyName(p.name)) {
                    ts.setTextRange(p.name, {
                        pos: -1,
                        end: -1
                    });
                }
            });
        }
        if (ts.isTemplateExpression(exp)) {
            ts.setTextRange(exp.head, { pos: -1, end: -1 });
            exp.templateSpans.forEach(span => {
                ts.setTextRange(span.literal, {
                    pos: -1,
                    end: -1
                });
            });
        }
        ts.setTextRange(exp, { pos: -1, end: -1 });
    }
    function isVAttribute(node) {
        return !node.directive;
    }
    function isVModel(node) {
        return node.directive && node.key.name.name === 'model';
    }
    function isVBind(node) {
        return node.directive && node.key.name.name === 'bind';
    }
    function isVBindShorthand(node) {
        return node.directive && node.key.name.name === 'bind' && node.key.name.rawName === ':';
    }
    function isVBindWithDynamicAttributeName(node) {
        var _a;
        return node.directive && ((_a = node.key.argument) === null || _a === void 0 ? void 0 : _a.type) === 'VExpressionContainer';
    }
    function isVOn(node) {
        return node.directive && node.key.name.name === 'on';
    }
    function isVIf(node) {
        return node.directive && node.key.name.name === 'if';
    }
    function isVElseIf(node) {
        return node.directive && node.key.name.name === 'else-if';
    }
    function isVElse(node) {
        return node.directive && node.key.name.name === 'else';
    }
    function isVFor(node) {
        return node.directive && node.key.name.name === 'for';
    }
    function isVSlot(node) {
        return node.directive && (node.key.name.name === 'slot' || node.key.name.name === 'slot-scope');
    }
}
exports.getTemplateTransformFunctions = getTemplateTransformFunctions;
//# sourceMappingURL=transformTemplate.js.map