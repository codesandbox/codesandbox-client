/* eslint-disable */
import { type LoaderContext } from '../../../../transpiled-module';
// vue compiler module for transforming `<tag>:<attribute>` to `require`

var defaultOptions = {
  img: 'src',
  image: 'xlink:href',
};

export default async (userOptions, addDependency) => {
  var options = userOptions
    ? { ...defaultOptions, userOptions }
    : defaultOptions;

  return {
    postTransformNode: node => {
      transform(node, options, addDependency);
    },
  };
};

function transform(node, options, addDependency) {
  for (var tag in options) {
    if (node.tag === tag && node.attrs) {
      var attributes = options[tag];
      if (typeof attributes === 'string') {
        node.attrs.some(attr => rewrite(attr, attributes, addDependency));
      } else if (Array.isArray(attributes)) {
        attributes.forEach(item =>
          node.attrs.some(attr => rewrite(attr, item, addDependency))
        );
      }
    }
  }
}

function rewrite(attr, name, addDependency) {
  if (attr.name === name) {
    var value = attr.value;
    var isStatic =
      value.charAt(0) === '"' && value.charAt(value.length - 1) === '"';
    if (!isStatic) {
      return;
    }
    var firstChar = value.charAt(1);
    if (firstChar === '.' || firstChar === '~') {
      if (firstChar === '~') {
        value = '"' + value.slice(2);
      }
      // get dependency the quotes
      attr.value = `require(${value})`;

      const rawDependency = value.slice(1).slice(0, -1);
      addDependency(rawDependency);
    }
    return true;
  }
}
