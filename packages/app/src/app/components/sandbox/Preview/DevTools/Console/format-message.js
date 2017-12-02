import './string-utils';

/* eslint-disable no-var, no-underscore-dangle, vars-on-top, no-use-before-define, no-plusplus, guard-for-in, no-restricted-syntax, no-param-reassign */

function createAppend(s: string) {
  const container = document.createDocumentFragment();
  container.appendChild(document.createTextNode(s));

  return container;
}

/**
   * @param {string} format
   * @param {!Array.<!SDK.RemoteObject>} parameters
   * @param {!Element} formattedResult
   */
export default function formatWithSubstitutionString(
  format,
  parameters,
  formattedResult
) {
  var formatters = {};

  function stringFormatter(obj) {
    return obj;
  }

  function floatFormatter(obj) {
    if (typeof obj !== 'number') return 'NaN';
    return obj;
  }

  function integerFormatter(obj) {
    if (typeof obj !== 'number') return 'NaN';
    return Math.floor(obj);
  }

  function bypassFormatter(obj) {
    return obj instanceof Node ? obj : '';
  }

  var currentStyle = null;
  function styleFormatter(obj) {
    currentStyle = {};
    var buffer = document.createElement('span');
    buffer.setAttribute('style', obj);
    for (var i = 0; i < buffer.style.length; i++) {
      var property = buffer.style[i];
      if (isWhitelistedProperty(property))
        currentStyle[property] = buffer.style[property];
    }
  }

  function isWhitelistedProperty(property) {
    var prefixes = [
      'background',
      'border',
      'color',
      'font',
      'line',
      'margin',
      'padding',
      'text',
      '-webkit-background',
      '-webkit-border',
      '-webkit-font',
      '-webkit-margin',
      '-webkit-padding',
      '-webkit-text',
    ];
    for (var i = 0; i < prefixes.length; i++) {
      if (property.startsWith(prefixes[i])) return true;
    }
    return false;
  }

  formatters.s = stringFormatter;
  formatters.f = floatFormatter;
  // Firebug allows both %i and %d for formatting integers.
  formatters.i = integerFormatter;
  formatters.d = integerFormatter;

  // Firebug uses %c for styling the message.
  formatters.c = styleFormatter;

  formatters._ = bypassFormatter;

  function append(a, b) {
    if (b instanceof Node) {
      a.appendChild(b);
    } else if (typeof b !== 'undefined') {
      var toAppend = createAppend(String(b));

      if (currentStyle) {
        var wrapper = document.createElement('span');
        wrapper.appendChild(toAppend);
        applyCurrentStyle(wrapper);
        for (var i = 0; i < wrapper.children.length; ++i)
          applyCurrentStyle(wrapper.children[i]);
        toAppend = wrapper;
      }
      a.appendChild(toAppend);
    }
    return a;
  }

  /**
     * @param {!Element} element
     */
  function applyCurrentStyle(element) {
    for (var key in currentStyle) element.style[key] = currentStyle[key];
  }

  // String.format does treat formattedResult like a Builder, result is an object.
  return String.format(format, parameters, formatters, formattedResult, append);
}
