/* eslint-disable */
/* globals __VUE_SSR_CONTEXT__ */

// IMPORTANT: Do NOT use ES2015 features in this file.
// This module is a runtime utility for cleaner component module output and will
// be included in the final webpack user bundle.

module.exports = function normalizeComponent(
  rawScriptExports,
  compiledTemplate,
  functionalTemplate,
  injectStyles,
  scopeId,
  moduleIdentifier /* server only */
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
    options._compiled = true;
  }

  // functional template
  if (functionalTemplate) {
    options.functional = true;
  }

  // scopedId
  if (scopeId) {
    options._scopeId = scopeId;
  }

  var hook;
  if (moduleIdentifier) {
    // server build
    hook = function(context) {
      // 2.3 injection
      context =
        context || // cached call
        (this.$vnode && this.$vnode.ssrContext) || // stateful
        (this.parent && this.parent.$vnode && this.parent.$vnode.ssrContext); // functional
      // 2.2 with runInNewContext: true
      if (!context && typeof __VUE_SSR_CONTEXT__ !== 'undefined') {
        context = __VUE_SSR_CONTEXT__;
      }
      // inject component styles
      if (injectStyles) {
        injectStyles.call(this, context);
      }
      // register component module identifier for async chunk inferrence
      if (context && context._registeredComponents) {
        context._registeredComponents.add(moduleIdentifier);
      }
    };
    // used by ssr in case component is cached and beforeCreate
    // never gets called
    options._ssrRegister = hook;
  } else if (injectStyles) {
    hook = injectStyles;
  }

  if (hook) {
    var functional = options.functional;
    var existing = functional ? options.render : options.beforeCreate;

    if (!functional) {
      // inject component registration as beforeCreate hook
      options.beforeCreate = existing ? [].concat(existing, hook) : [hook];
    } else {
      // for template-only hot-reload because in that case the render fn doesn't
      // go through the normalizer
      options._injectStyles = hook;
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
