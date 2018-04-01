/* eslint-env worker */
/* eslint no-var: off, strict: off */

// "Polyfills" in order for all the code to run
// "Polyfills" in order for all the code to run
self.global = self;
self.util = {};
self.path = {};
self.path.resolve = self.path.join = self.path.dirname = function() {
  return "";
};
self.path.parse = function() {
  return { root: "" };
};
self.Buffer = {
  isBuffer: function() {
    return false;
  }
};
self.constants = {};
// eslint-disable-next-line
module$1 = module = os = crypto = {};
self.fs = { readFile: function() {} };
// eslint-disable-next-line no-undef
os.homedir = function() {
  return "/home/prettier";
};
self.process = {
  argv: [],
  env: { PRETTIER_DEBUG: true },
  version: "v8.5.0",
  binding: function() {
    return {};
  },
  cwd: function() {
    return "";
  }
};
self.assert = { ok: function() {}, strictEqual: function() {} };
self.require = function require(path) {
  if (path === "stream") {
    return { PassThrough() {} };
  }
  if (path === "./third-party") {
    return {};
  }

  if (~path.indexOf("parser-")) {
    var parser = path.replace(/.+-/, "");
    if (!parsersLoaded[parser]) {
      importScripts("/static/js/prettier/1.10.2/parser-" + parser + ".js");
      parsersLoaded[parser] = true;
    }
    return self[parser];
  }

  return self[path]
};

var prettier;
importScripts('/static/js/prettier/1.10.2/index.js');
if (typeof prettier === "undefined") {
  prettier = module.exports; // eslint-disable-line
}
if (typeof prettier === "undefined") {
  prettier = index; // eslint-disable-line
}

var parsersLoaded = {};

self.onmessage = function(message) {
  var options = message.data.options || {};
  options.parser = options.parser || 'babylon';
  try {
    var formatted = formatCode(message.data.text, options);
  } catch (e) {
    self.postMessage({ error: e.message, text: message.data.text });
    return;
  }
  var doc;
  var ast;

  if (message.data.ast) {
    try {
      ast = JSON.stringify(
        prettier.__debug.parse(message.data.text, options),
        null,
        2
      );
    } catch (e) {
      ast = e.toString();
    }
  }

  if (message.data.doc) {
    lazyLoadParser('babylon');
    try {
      doc = prettier.__debug.formatDoc(
        prettier.__debug.printToDoc(message.data.text, options),
        { parser: 'babylon' }
      );
    } catch (e) {
      doc = e.toString();
    }
  }

  self.postMessage({
    formatted: formatted,
    text: message.data.text,
    doc: doc,
    ast: ast,
  });
};

function formatCode(text, options) {
  try {
    return prettier.format(text, options);
  } catch (e) {
    if (e.constructor && e.constructor.name === "SyntaxError") {
      // Likely something wrong with the user's code
      throw e;
    }
    // Likely a bug in Prettier
    // Provide the whole stack for debugging
    throw e;
  }
}
