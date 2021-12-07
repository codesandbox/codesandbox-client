/* eslint-disable prefer-object-spread */
/* eslint-disable no-param-reassign */
/* eslint-disable no-use-before-define */
import { toH } from 'hast-to-hyperscript';
// @ts-expect-error: hush.
import { whitespace } from 'hast-util-whitespace';

const own = {}.hasOwnProperty;
const tableElements = new Set([
  'table',
  'thead',
  'tbody',
  'tfoot',
  'tr',
  'th',
  'td',
]);

/**
 * @type {import('unified').Plugin<[Options], Root, ReactElement>}
 */
export default function rehypeReact(options) {
  if (!options || typeof options.createElement !== 'function') {
    throw new TypeError('createElement is not a function');
  }

  const createElement = options.createElement;

  Object.assign(this, { Compiler: compiler });

  /** @type {import('unified').CompilerFunction<Root, ReactNode>} */
  function compiler(node) {
    /** @type {ReactNode} */
    // @ts-expect-error: assume `name` is a known element.
    let result = toH(h, node, options.prefix);

    if (node.type === 'root') {
      // Invert <https://github.com/syntax-tree/hast-to-hyperscript/blob/d227372/index.js#L46-L56>.
      result =
        result &&
        typeof result === 'object' &&
        'type' in result &&
        'props' in result &&
        result.type === 'div' &&
        (node.children.length !== 1 || node.children[0].type !== 'element')
          ? // `children` does exist.
            // type-coverage:ignore-next-line
            result.props.children
          : [result];

      return createElement(options.Fragment || 'div', {}, result);
    }

    return result;
  }

  /**
   * @param {keyof JSX.IntrinsicElements} name
   * @param {Record<string, unknown>} props
   * @param {unknown[]} [children]
   * @returns {ReactNode}
   */
  function h(name, props, children) {
    // Currently, a warning is triggered by react for *any* white space in
    // tables.
    // So we remove the pretty lines for now.
    // See: <https://github.com/facebook/react/pull/7081>.
    // See: <https://github.com/facebook/react/pull/7515>.
    // See: <https://github.com/remarkjs/remark-react/issues/64>.
    if (children && tableElements.has(name)) {
      children = children.filter(child => !whitespace(child));
    }

    if (options.components && own.call(options.components, name)) {
      const component = options.components[name];

      if (options.passNode && typeof component === 'function') {
        // @ts-expect-error: `toH` passes the current node.
        // type-coverage:ignore-next-line
        props = Object.assign({ node: this }, props);
      }

      return createElement(component, props, children);
    }

    return createElement(name, props, children);
  }
}
