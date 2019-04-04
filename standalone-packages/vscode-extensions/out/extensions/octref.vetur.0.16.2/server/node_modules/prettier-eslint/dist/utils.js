"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.requireModule = exports.getOptionsForFormatting = exports.getESLintCLIEngine = undefined;

var _keys = require("babel-runtime/core-js/object/keys");

var _keys2 = _interopRequireDefault(_keys);

var _extends2 = require("babel-runtime/helpers/extends");

var _extends3 = _interopRequireDefault(_extends2);

var _stringify = require("babel-runtime/core-js/json/stringify");

var _stringify2 = _interopRequireDefault(_stringify);

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _map = require("babel-runtime/core-js/map");

var _map2 = _interopRequireDefault(_map);

var _commonTags = require("common-tags");

var _dlv = require("dlv");

var _dlv2 = _interopRequireDefault(_dlv);

var _loglevelColoredLevelPrefix = require("loglevel-colored-level-prefix");

var _loglevelColoredLevelPrefix2 = _interopRequireDefault(_loglevelColoredLevelPrefix);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _loglevelColoredLevelPrefix2.default)({ prefix: "prettier-eslint" }); /* eslint import/no-dynamic-require:0 */

var RULE_DISABLED = {};
var RULE_NOT_CONFIGURED = "RULE_NOT_CONFIGURED";
var ruleValueExists = function ruleValueExists(prettierRuleValue) {
  return prettierRuleValue !== RULE_NOT_CONFIGURED && prettierRuleValue !== RULE_DISABLED && typeof prettierRuleValue !== "undefined";
};
var OPTION_GETTERS = {
  printWidth: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "max-len", "code");
    },
    ruleValueToPrettierOption: getPrintWidth
  },
  tabWidth: {
    ruleValue: function ruleValue(rules) {
      var value = getRuleValue(rules, "indent");
      if (value === "tab") {
        value = getRuleValue(rules, "max-len", "tabWidth");
      }
      return value;
    },
    ruleValueToPrettierOption: getTabWidth
  },
  singleQuote: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "quotes");
    },
    ruleValueToPrettierOption: getSingleQuote
  },
  trailingComma: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "comma-dangle", []);
    },
    ruleValueToPrettierOption: getTrailingComma
  },
  bracketSpacing: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "object-curly-spacing");
    },
    ruleValueToPrettierOption: getBracketSpacing
  },
  semi: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "semi");
    },
    ruleValueToPrettierOption: getSemi
  },
  useTabs: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "indent");
    },
    ruleValueToPrettierOption: getUseTabs
  },
  jsxBracketSameLine: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "react/jsx-closing-bracket-location", "nonEmpty");
    },
    ruleValueToPrettierOption: getJsxBracketSameLine
  },
  arrowParens: {
    ruleValue: function ruleValue(rules) {
      return getRuleValue(rules, "arrow-parens");
    },
    ruleValueToPrettierOption: getArrowParens
  }
};

/* eslint import/prefer-default-export:0 */
exports.getESLintCLIEngine = getESLintCLIEngine;
exports.getOptionsForFormatting = getOptionsForFormatting;
exports.requireModule = requireModule;


function getOptionsForFormatting(eslintConfig) {
  var prettierOptions = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var fallbackPrettierOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var eslintPath = arguments[3];

  var eslint = getRelevantESLintConfig(eslintConfig, eslintPath);
  var prettier = getPrettierOptionsFromESLintRules(eslintConfig, prettierOptions, fallbackPrettierOptions);
  return { eslint, prettier };
}

function getRelevantESLintConfig(eslintConfig, eslintPath) {
  var cliEngine = getESLintCLIEngine(eslintPath);
  // TODO: Actually test this branch
  // istanbul ignore next
  var loadedRules = cliEngine.getRules && cliEngine.getRules() ||
  // XXX: Fallback list of unfixable rules, when using and old version of eslint
  new _map2.default([["global-require", { meta: {} }], ["no-with", { meta: {} }]]);

  var rules = eslintConfig.rules;


  logger.debug("turning off unfixable rules");

  var relevantRules = (0, _entries2.default)(rules).reduce(function (rulesAccumulator, _ref) {
    var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
        name = _ref2[0],
        rule = _ref2[1];

    if (loadedRules.has(name)) {
      var _loadedRules$get = loadedRules.get(name),
          fixable = _loadedRules$get.meta.fixable;

      if (!fixable) {
        logger.trace("turing off rule:", (0, _stringify2.default)({ [name]: rule }));
        rule = ["off"];
      }
    }

    rulesAccumulator[name] = rule;
    return rulesAccumulator;
  }, {});

  return (0, _extends3.default)({
    // defaults
    useEslintrc: false
  }, eslintConfig, {
    // overrides
    rules: relevantRules,
    fix: true,
    globals: []
  });
}

/**
 * This accepts an eslintConfig object and converts
 * it to the `prettier` options object
 */
function getPrettierOptionsFromESLintRules(eslintConfig, prettierOptions, fallbackPrettierOptions) {
  var rules = eslintConfig.rules;


  var prettierPluginOptions = getRuleValue(rules, "prettier/prettier", []);

  if (ruleValueExists(prettierPluginOptions)) {
    prettierOptions = (0, _extends3.default)({}, prettierPluginOptions, prettierOptions);
  }

  return (0, _keys2.default)(OPTION_GETTERS).reduce(function (options, key) {
    return configureOptions(prettierOptions, fallbackPrettierOptions, key, options, rules);
  }, prettierOptions);
}

// If an ESLint rule that prettier can be configured with is enabled create a
// prettier configuration object that reflects the ESLint rule configuration.
function configureOptions(prettierOptions, fallbackPrettierOptions, key, options, rules) {
  var givenOption = prettierOptions[key];
  var optionIsGiven = givenOption !== undefined;

  if (optionIsGiven) {
    options[key] = givenOption;
  } else {
    var _OPTION_GETTERS$key = OPTION_GETTERS[key],
        ruleValue = _OPTION_GETTERS$key.ruleValue,
        ruleValueToPrettierOption = _OPTION_GETTERS$key.ruleValueToPrettierOption;

    var eslintRuleValue = ruleValue(rules);

    var option = ruleValueToPrettierOption(eslintRuleValue, fallbackPrettierOptions, rules);

    if (option !== undefined) {
      options[key] = option;
    }
  }

  return options;
}

function getPrintWidth(eslintValue, fallbacks) {
  return makePrettierOption("printWidth", eslintValue, fallbacks);
}

function getTabWidth(eslintValue, fallbacks) {
  return makePrettierOption("tabWidth", eslintValue, fallbacks);
}

function getSingleQuote(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "single") {
    prettierValue = true;
  } else if (eslintValue === "double") {
    prettierValue = false;
  } else if (eslintValue === "backtick") {
    prettierValue = false;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption("singleQuote", prettierValue, fallbacks);
}

function getTrailingComma(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "never") {
    prettierValue = "none";
  } else if (typeof eslintValue === "string" && eslintValue.indexOf("always") === 0) {
    prettierValue = "es5";
  } else if (typeof eslintValue === "object") {
    prettierValue = getValFromTrailingCommaConfig(eslintValue);
  } else {
    prettierValue = RULE_NOT_CONFIGURED;
  }

  return makePrettierOption("trailingComma", prettierValue, fallbacks);
}

function getValFromTrailingCommaConfig(objectConfig) {
  var _objectConfig$arrays = objectConfig.arrays,
      arrays = _objectConfig$arrays === undefined ? "" : _objectConfig$arrays,
      _objectConfig$objects = objectConfig.objects,
      objects = _objectConfig$objects === undefined ? "" : _objectConfig$objects,
      _objectConfig$functio = objectConfig.functions,
      functions = _objectConfig$functio === undefined ? "" : _objectConfig$functio;

  var fns = isAlways(functions);
  var es5 = [arrays, objects].some(isAlways);

  if (fns) {
    return "all";
  } else if (es5) {
    return "es5";
  } else {
    return "none";
  }
}

function getBracketSpacing(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "never") {
    prettierValue = false;
  } else if (eslintValue === "always") {
    prettierValue = true;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption("bracketSpacing", prettierValue, fallbacks);
}

function getSemi(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "never") {
    prettierValue = false;
  } else if (eslintValue === "always") {
    prettierValue = true;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption("semi", prettierValue, fallbacks);
}

function getUseTabs(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "tab") {
    prettierValue = true;
  } else {
    prettierValue = RULE_NOT_CONFIGURED;
  }

  return makePrettierOption("useTabs", prettierValue, fallbacks);
}

function getJsxBracketSameLine(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "after-props") {
    prettierValue = true;
  } else if (eslintValue === "tag-aligned" || eslintValue === "line-aligned" || eslintValue === "props-aligned") {
    prettierValue = false;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption("jsxBracketSameLine", prettierValue, fallbacks);
}

function getArrowParens(eslintValue, fallbacks) {
  var prettierValue = void 0;

  if (eslintValue === "as-needed") {
    prettierValue = "avoid";
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption("arrowParens", prettierValue, fallbacks);
}

function extractRuleValue(objPath, name, value) {
  // XXX: Ignore code coverage for the following else case
  // There are currently no eslint rules which we can infer prettier
  // options from, that have an object option which we don't know how
  // to infer from.

  // istanbul ignore else
  if (objPath) {
    logger.trace(_commonTags.oneLine`
        Getting the value from object configuration of ${name}.
        delving into ${(0, _stringify2.default)(value)} with path "${objPath}"
      `);

    return (0, _dlv2.default)(value, objPath, RULE_NOT_CONFIGURED);
  }

  // istanbul ignore next
  logger.debug(_commonTags.oneLine`
      The ${name} rule is using an object configuration
      of ${(0, _stringify2.default)(value)} but prettier-eslint is
      not currently capable of getting the prettier value
      based on an object configuration for ${name}.
      Please file an issue (and make a pull request?)
    `);

  // istanbul ignore next
  return undefined;
}

function getRuleValue(rules, name, objPath) {
  var ruleConfig = rules[name];

  if (Array.isArray(ruleConfig)) {
    var _ruleConfig = (0, _slicedToArray3.default)(ruleConfig, 2),
        ruleSetting = _ruleConfig[0],
        value = _ruleConfig[1];

    // If `ruleSetting` is set to disable the ESLint rule don't use `value` as
    // it might be a value provided by an overriden config package e.g. airbnb
    // overriden by config-prettier. The airbnb values are provided even though
    // config-prettier disables the rule. Instead use fallback or prettier
    // default.


    if (ruleSetting === 0 || ruleSetting === "off") {
      return RULE_DISABLED;
    }

    if (typeof value === "object") {
      return extractRuleValue(objPath, name, value);
    } else {
      logger.trace(_commonTags.oneLine`
          The ${name} rule is configured with a
          non-object value of ${value}. Using that value.
        `);
      return value;
    }
  }

  return RULE_NOT_CONFIGURED;
}

function isAlways(val) {
  return val.indexOf("always") === 0;
}

function makePrettierOption(prettierRuleName, prettierRuleValue, fallbacks) {
  if (ruleValueExists(prettierRuleValue)) {
    return prettierRuleValue;
  }

  var fallback = fallbacks[prettierRuleName];
  if (typeof fallback !== "undefined") {
    logger.debug(_commonTags.oneLine`
        The ${prettierRuleName} rule is not configured,
        using provided fallback of ${fallback}
      `);
    return fallback;
  }

  logger.debug(_commonTags.oneLine`
      The ${prettierRuleName} rule is not configured,
      let prettier decide
    `);
  return undefined;
}

function requireModule(modulePath, name) {
  try {
    logger.trace(`requiring "${name}" module at "${modulePath}"`);
    return require(modulePath);
  } catch (error) {
    logger.error(_commonTags.oneLine`
      There was trouble getting "${name}".
      Is "${modulePath}" a correct path to the "${name}" module?
    `);
    throw error;
  }
}

function getESLintCLIEngine(eslintPath, eslintOptions) {
  var _requireModule = requireModule(eslintPath, "eslint"),
      CLIEngine = _requireModule.CLIEngine;

  try {
    return new CLIEngine(eslintOptions);
  } catch (error) {
    logger.error(`There was trouble creating the ESLint CLIEngine.`);
    throw error;
  }
}