// this module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle

module.exports = function normalizeComponent(
  rawScriptExports,
  compiledTemplate,
  injectStyles,
  scopeId
) {
  var esModule;
  var scriptExports = (rawScriptExports = rawScriptExports || {});

  // ES6 modules interop
  var type = typeof rawScriptExports.default;
  if (type === 'object' || type === 'function') {
    esModule = rawScriptExports;
    scriptExports = rawScriptExports.default;
  }

  // Vue.extend constructor export interop
  var options =
    typeof scriptExports === 'function' ? scriptExports.options : scriptExports;

  // render functions
  if (compiledTemplate) {
    options.render = compiledTemplate.render;
    options.staticRenderFns = compiledTemplate.staticRenderFns;
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;
  if (injectStyles) {
    hook = injectStyles;
  }

  if (hook) {
    var functional = options.functional;
    var existing = functional ? options.render : options.beforeCreate;
    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    } else {
      // register for functioal component in vue file
      options.render = function renderWithStyleInjection(h, context) {
        hook.call(context);
        return existing(h, context);
      };
    }
  }

  return {
    esModule: esModule,
    exports: scriptExports,
    options: options,
  };
};
