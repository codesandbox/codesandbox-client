const g = typeof window === 'undefined' ? self : window;

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
