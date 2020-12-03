"use strict";

require("core-js/modules/es.array.iterator");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getESLintCLIEngine = getESLintCLIEngine;
exports.getOptionsForFormatting = getOptionsForFormatting;
exports.requireModule = requireModule;

var _commonTags = require("common-tags");

var _dlv = _interopRequireDefault(require("dlv"));

var _loglevelColoredLevelPrefix = _interopRequireDefault(require("loglevel-colored-level-prefix"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = (0, _loglevelColoredLevelPrefix.default)({
  prefix: 'prettier-eslint'
});
const RULE_DISABLED = {};
const RULE_NOT_CONFIGURED = 'RULE_NOT_CONFIGURED';

const ruleValueExists = prettierRuleValue => prettierRuleValue !== RULE_NOT_CONFIGURED && prettierRuleValue !== RULE_DISABLED && typeof prettierRuleValue !== 'undefined';

const OPTION_GETTERS = {
  printWidth: {
    ruleValue: rules => getRuleValue(rules, 'max-len', 'code'),
    ruleValueToPrettierOption: getPrintWidth
  },
  tabWidth: {
    ruleValue: rules => {
      let value = getRuleValue(rules, 'indent');

      if (value === 'tab') {
        value = getRuleValue(rules, 'max-len', 'tabWidth');
      }

      return value;
    },
    ruleValueToPrettierOption: getTabWidth
  },
  singleQuote: {
    ruleValue: rules => getRuleValue(rules, 'quotes'),
    ruleValueToPrettierOption: getSingleQuote
  },
  trailingComma: {
    ruleValue: rules => getRuleValue(rules, 'comma-dangle', []),
    ruleValueToPrettierOption: getTrailingComma
  },
  bracketSpacing: {
    ruleValue: rules => getRuleValue(rules, 'object-curly-spacing'),
    ruleValueToPrettierOption: getBracketSpacing
  },
  semi: {
    ruleValue: rules => getRuleValue(rules, 'semi'),
    ruleValueToPrettierOption: getSemi
  },
  useTabs: {
    ruleValue: rules => getRuleValue(rules, 'indent'),
    ruleValueToPrettierOption: getUseTabs
  },
  jsxBracketSameLine: {
    ruleValue: rules => getRuleValue(rules, 'react/jsx-closing-bracket-location', 'nonEmpty'),
    ruleValueToPrettierOption: getJsxBracketSameLine
  },
  arrowParens: {
    ruleValue: rules => getRuleValue(rules, 'arrow-parens'),
    ruleValueToPrettierOption: getArrowParens
  }
};
/* eslint import/prefer-default-export:0 */

function getOptionsForFormatting(eslintConfig, prettierOptions = {}, fallbackPrettierOptions = {}, eslintPath) {
  const eslint = getRelevantESLintConfig(eslintConfig, eslintPath);
  const prettier = getPrettierOptionsFromESLintRules(eslintConfig, prettierOptions, fallbackPrettierOptions);
  return {
    eslint,
    prettier
  };
}

function getRelevantESLintConfig(eslintConfig, eslintPath) {
  const cliEngine = getESLintCLIEngine(eslintPath); // TODO: Actually test this branch
  // istanbul ignore next

  const loadedRules = cliEngine.getRules && cliEngine.getRules() || // XXX: Fallback list of unfixable rules, when using and old version of eslint
  new Map([['global-require', {
    meta: {}
  }], ['no-with', {
    meta: {}
  }]]);
  const {
    rules
  } = eslintConfig;
  logger.debug('turning off unfixable rules');
  const relevantRules = Object.entries(rules).reduce((rulesAccumulator, [name, rule]) => {
    if (loadedRules.has(name)) {
      const {
        meta: {
          fixable
        }
      } = loadedRules.get(name);

      if (!fixable) {
        logger.trace('turing off rule:', JSON.stringify({
          [name]: rule
        }));
        rule = ['off'];
      }
    }

    rulesAccumulator[name] = rule;
    return rulesAccumulator;
  }, {});
  return _objectSpread(_objectSpread({
    // defaults
    useEslintrc: false,
    baseConfig: {
      settings: eslintConfig.settings || {}
    }
  }, eslintConfig), {}, {
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
  const {
    rules
  } = eslintConfig;
  const prettierPluginOptions = getRuleValue(rules, 'prettier/prettier', []);

  if (ruleValueExists(prettierPluginOptions)) {
    prettierOptions = _objectSpread(_objectSpread({}, prettierPluginOptions), prettierOptions);
  }

  return Object.keys(OPTION_GETTERS).reduce((options, key) => configureOptions(prettierOptions, fallbackPrettierOptions, key, options, rules), prettierOptions);
} // If an ESLint rule that prettier can be configured with is enabled create a
// prettier configuration object that reflects the ESLint rule configuration.


function configureOptions(prettierOptions, fallbackPrettierOptions, key, options, rules) {
  const givenOption = prettierOptions[key];
  const optionIsGiven = givenOption !== undefined;

  if (optionIsGiven) {
    options[key] = givenOption;
  } else {
    const {
      ruleValue,
      ruleValueToPrettierOption
    } = OPTION_GETTERS[key];
    const eslintRuleValue = ruleValue(rules);
    const option = ruleValueToPrettierOption(eslintRuleValue, fallbackPrettierOptions, rules);

    if (option !== undefined) {
      options[key] = option;
    }
  }

  return options;
}

function getPrintWidth(eslintValue, fallbacks) {
  return makePrettierOption('printWidth', eslintValue, fallbacks);
}

function getTabWidth(eslintValue, fallbacks) {
  return makePrettierOption('tabWidth', eslintValue, fallbacks);
}

function getSingleQuote(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'single') {
    prettierValue = true;
  } else if (eslintValue === 'double') {
    prettierValue = false;
  } else if (eslintValue === 'backtick') {
    prettierValue = false;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption('singleQuote', prettierValue, fallbacks);
}

function getTrailingComma(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'never') {
    prettierValue = 'none';
  } else if (typeof eslintValue === 'string' && eslintValue.indexOf('always') === 0) {
    prettierValue = 'es5';
  } else if (typeof eslintValue === 'object') {
    prettierValue = getValFromTrailingCommaConfig(eslintValue);
  } else {
    prettierValue = RULE_NOT_CONFIGURED;
  }

  return makePrettierOption('trailingComma', prettierValue, fallbacks);
}

function getValFromTrailingCommaConfig(objectConfig) {
  const {
    arrays = '',
    objects = '',
    functions = ''
  } = objectConfig;
  const fns = isAlways(functions);
  const es5 = [arrays, objects].some(isAlways);

  if (fns) {
    return 'all';
  } else if (es5) {
    return 'es5';
  } else {
    return 'none';
  }
}

function getBracketSpacing(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'never') {
    prettierValue = false;
  } else if (eslintValue === 'always') {
    prettierValue = true;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption('bracketSpacing', prettierValue, fallbacks);
}

function getSemi(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'never') {
    prettierValue = false;
  } else if (eslintValue === 'always') {
    prettierValue = true;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption('semi', prettierValue, fallbacks);
}

function getUseTabs(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'tab') {
    prettierValue = true;
  } else {
    prettierValue = RULE_NOT_CONFIGURED;
  }

  return makePrettierOption('useTabs', prettierValue, fallbacks);
}

function getJsxBracketSameLine(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'after-props') {
    prettierValue = true;
  } else if (eslintValue === 'tag-aligned' || eslintValue === 'line-aligned' || eslintValue === 'props-aligned') {
    prettierValue = false;
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption('jsxBracketSameLine', prettierValue, fallbacks);
}

function getArrowParens(eslintValue, fallbacks) {
  let prettierValue;

  if (eslintValue === 'as-needed') {
    prettierValue = 'avoid';
  } else {
    prettierValue = eslintValue;
  }

  return makePrettierOption('arrowParens', prettierValue, fallbacks);
}

function extractRuleValue(objPath, name, value) {
  // XXX: Ignore code coverage for the following else case
  // There are currently no eslint rules which we can infer prettier
  // options from, that have an object option which we don't know how
  // to infer from.
  // istanbul ignore else
  if (objPath) {
    logger.trace((0, _commonTags.oneLine)`
        Getting the value from object configuration of ${name}.
        delving into ${JSON.stringify(value)} with path "${objPath}"
      `);
    return (0, _dlv.default)(value, objPath, RULE_NOT_CONFIGURED);
  } // istanbul ignore next


  logger.debug((0, _commonTags.oneLine)`
      The ${name} rule is using an object configuration
      of ${JSON.stringify(value)} but prettier-eslint is
      not currently capable of getting the prettier value
      based on an object configuration for ${name}.
      Please file an issue (and make a pull request?)
    `); // istanbul ignore next

  return undefined;
}

function getRuleValue(rules, name, objPath) {
  const ruleConfig = rules[name];

  if (Array.isArray(ruleConfig)) {
    const [ruleSetting, value] = ruleConfig; // If `ruleSetting` is set to disable the ESLint rule don't use `value` as
    // it might be a value provided by an overriden config package e.g. airbnb
    // overriden by config-prettier. The airbnb values are provided even though
    // config-prettier disables the rule. Instead use fallback or prettier
    // default.

    if (ruleSetting === 0 || ruleSetting === 'off') {
      return RULE_DISABLED;
    }

    if (typeof value === 'object') {
      return extractRuleValue(objPath, name, value);
    } else {
      logger.trace((0, _commonTags.oneLine)`
          The ${name} rule is configured with a
          non-object value of ${value}. Using that value.
        `);
      return value;
    }
  }

  return RULE_NOT_CONFIGURED;
}

function isAlways(val) {
  return val.indexOf('always') === 0;
}

function makePrettierOption(prettierRuleName, prettierRuleValue, fallbacks) {
  if (ruleValueExists(prettierRuleValue)) {
    return prettierRuleValue;
  }

  const fallback = fallbacks[prettierRuleName];

  if (typeof fallback !== 'undefined') {
    logger.debug((0, _commonTags.oneLine)`
        The ${prettierRuleName} rule is not configured,
        using provided fallback of ${fallback}
      `);
    return fallback;
  }

  logger.debug((0, _commonTags.oneLine)`
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
    logger.error((0, _commonTags.oneLine)`
      There was trouble getting "${name}".
      Is "${modulePath}" a correct path to the "${name}" module?
    `);
    throw error;
  }
}

function getESLintCLIEngine(eslintPath, eslintOptions) {
  const {
    CLIEngine
  } = requireModule(eslintPath, 'eslint');

  try {
    return new CLIEngine(eslintOptions);
  } catch (error) {
    logger.error(`There was trouble creating the ESLint CLIEngine.`);
    throw error;
  }
}