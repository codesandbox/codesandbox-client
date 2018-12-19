const g = typeof window === 'undefined' ? self : window;

if (typeof Promise === 'undefined') {
  // Rejection tracking prevents a common issue where React gets into an
  // inconsistent state due to an error, but it gets swallowed by a Promise,
  // and the user has no idea what causes React's erratic future behavior.
  require('promise/lib/rejection-tracking').enable();
  g.Promise = require('promise/lib/es6-extensions.js');
}

// fetch() polyfill for making API calls.
require('whatwg-fetch');

g.cosmiconfig = {};
g.prettier = {};
g.jsdom = {
  JSDOM: {
    // IE11 support
    // eslint-disable-next-line object-shorthand
    fragment: function fragment(htmlString) {
      // eslint-disable-next-line no-var
      var div = document.createElement('div');
      div.innerHTML = htmlString.trim();

      // Change this to div.childNodes to support multiple top-level nodes
      return div;
    },
  },
};

// IE11
require('core-js/fn/array/find');
require('core-js/fn/array/from');
require('core-js/fn/object/assign');
require('core-js/fn/symbol');
