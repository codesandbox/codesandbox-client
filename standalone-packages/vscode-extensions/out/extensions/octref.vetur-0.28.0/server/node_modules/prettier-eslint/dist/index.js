"use strict";

require("core-js/modules/es.array.iterator");

require("core-js/modules/es.string.trim-start");

require("core-js/modules/es.string.trim-end");

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _requireRelative = _interopRequireDefault(require("require-relative"));

var _prettyFormat = _interopRequireDefault(require("pretty-format"));

var _commonTags = require("common-tags");

var _indentString = _interopRequireDefault(require("indent-string"));

var _loglevelColoredLevelPrefix = _interopRequireDefault(require("loglevel-colored-level-prefix"));

var _lodash = _interopRequireDefault(require("lodash.merge"));

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

const logger = (0, _loglevelColoredLevelPrefix.default)({
  prefix: 'prettier-eslint'
}); // CommonJS + ES6 modules... is it worth it? Probably not...

module.exports = format;
/**
 * Formats the text with prettier and then eslint based on the given options
 * @param {String} options.filePath - the path of the file being formatted
 *  can be used in leu of `eslintConfig` (eslint will be used to find the
 *  relevant config for the file). Will also be used to load the `text` if
 *  `text` is not provided.
 * @param {String} options.text - the text (JavaScript code) to format
 * @param {String} options.eslintPath - the path to the eslint module to use.
 *   Will default to require.resolve('eslint')
 * @param {String} options.prettierPath - the path to the prettier module.
 *   Will default to require.resovlve('prettier')
 * @param {Object} options.eslintConfig - the config to use for formatting
 *  with ESLint.
 * @param {Object} options.prettierOptions - the options to pass for
 *  formatting with `prettier`. If not provided, prettier-eslint will attempt
 *  to create the options based on the eslintConfig
 * @param {Object} options.fallbackPrettierOptions - the options to pass for
 *  formatting with `prettier` if the given option is not inferrable from the
 *  eslintConfig.
 * @param {String} options.logLevel - the level for the logs
 *  (error, warn, info, debug, trace)
 * @param {Boolean} options.prettierLast - Run Prettier Last
 * @return {String} - the formatted string
 */

function format(options) {
  const {
    logLevel = getDefaultLogLevel()
  } = options;
  logger.setLevel(logLevel);
  logger.trace('called format with options:', (0, _prettyFormat.default)(options));
  const {
    filePath,
    text = getTextFromFilePath(filePath),
    eslintPath = getModulePath(filePath, 'eslint'),
    prettierPath = getModulePath(filePath, 'prettier'),
    prettierLast,
    fallbackPrettierOptions
  } = options;
  const eslintConfig = (0, _lodash.default)({}, options.eslintConfig, getESLintConfig(filePath, eslintPath));

  if (typeof eslintConfig.globals === 'object') {
    eslintConfig.globals = Object.entries(eslintConfig.globals).map(([key, value]) => `${key}:${value}`);
  }

  const prettierOptions = (0, _lodash.default)({}, filePath && {
    filepath: filePath
  }, getPrettierConfig(filePath, prettierPath), options.prettierOptions);
  const formattingOptions = (0, _utils.getOptionsForFormatting)(eslintConfig, prettierOptions, fallbackPrettierOptions, eslintPath);
  logger.debug('inferred options:', (0, _prettyFormat.default)({
    filePath,
    text,
    eslintPath,
    prettierPath,
    eslintConfig: formattingOptions.eslint,
    prettierOptions: formattingOptions.prettier,
    logLevel,
    prettierLast
  }));
  const eslintExtensions = eslintConfig.extensions || ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.vue'];

  const fileExtension = _path.default.extname(filePath || ''); // If we don't get filePath run eslint on text, otherwise only run eslint
  // if it's a configured extension or fall back to a "supported" file type.


  const onlyPrettier = filePath ? !eslintExtensions.includes(fileExtension) : false;
  const prettify = createPrettify(formattingOptions.prettier, prettierPath);

  if (onlyPrettier) {
    return prettify(text);
  }

  if (['.ts', '.tsx'].includes(fileExtension)) {
    formattingOptions.eslint.parser = formattingOptions.eslint.parser || require.resolve('@typescript-eslint/parser');
  }

  if (['.vue'].includes(fileExtension)) {
    formattingOptions.eslint.parser = formattingOptions.eslint.parser || require.resolve('vue-eslint-parser');
  }

  const eslintFix = createEslintFix(formattingOptions.eslint, eslintPath);

  if (prettierLast) {
    return prettify(eslintFix(text, filePath));
  }

  return eslintFix(prettify(text), filePath);
}

function createPrettify(formatOptions, prettierPath) {
  return function prettify(text) {
    logger.debug('calling prettier on text');
    logger.trace((0, _commonTags.stripIndent)`
      prettier input:

      ${(0, _indentString.default)(text, 2)}
    `);
    const prettier = (0, _utils.requireModule)(prettierPath, 'prettier');

    try {
      logger.trace(`calling prettier.format with the text and prettierOptions`);
      const output = prettier.format(text, formatOptions);
      logger.trace('prettier: output === input', output === text);
      logger.trace((0, _commonTags.stripIndent)`
        prettier output:

        ${(0, _indentString.default)(output, 2)}
      `);
      return output;
    } catch (error) {
      logger.error('prettier formatting failed due to a prettier error');
      throw error;
    }
  };
}

function createEslintFix(eslintConfig, eslintPath) {
  return function eslintFix(text, filePath) {
    const cliEngine = (0, _utils.getESLintCLIEngine)(eslintPath, eslintConfig);

    try {
      logger.trace(`calling cliEngine.executeOnText with the text`);
      const report = cliEngine.executeOnText(text, filePath, true);
      logger.trace(`executeOnText returned the following report:`, (0, _prettyFormat.default)(report)); // default the output to text because if there's nothing
      // to fix, eslint doesn't provide `output`

      const [{
        output = text
      }] = report.results;
      logger.trace('eslint --fix: output === input', output === text); // NOTE: We're ignoring linting errors/warnings here and
      // defaulting to the given text if there are any
      // because all we're trying to do is fix what we can.
      // We don't care about what we can't

      logger.trace((0, _commonTags.stripIndent)`
        eslint --fix output:

        ${(0, _indentString.default)(output, 2)}
      `);
      return output;
    } catch (error) {
      logger.error('eslint fix failed due to an eslint error');
      throw error;
    }
  };
}

function getTextFromFilePath(filePath) {
  try {
    logger.trace((0, _commonTags.oneLine)`
        attempting fs.readFileSync to get
        the text for file at "${filePath}"
      `);
    return _fs.default.readFileSync(filePath, 'utf8');
  } catch (error) {
    logger.error((0, _commonTags.oneLine)`
        failed to get the text to format
        from the given filePath: "${filePath}"
      `);
    throw error;
  }
}

function getESLintConfig(filePath, eslintPath) {
  const eslintOptions = {};

  if (filePath) {
    eslintOptions.cwd = _path.default.dirname(filePath);
  }

  logger.trace((0, _commonTags.oneLine)`
      creating ESLint CLI Engine to get the config for
      "${filePath || process.cwd()}"
    `);
  const cliEngine = (0, _utils.getESLintCLIEngine)(eslintPath, eslintOptions);

  try {
    logger.debug(`getting eslint config for file at "${filePath}"`);
    const config = cliEngine.getConfigForFile(filePath);
    logger.trace(`eslint config for "${filePath}" received`, (0, _prettyFormat.default)(config));
    return _objectSpread(_objectSpread({}, eslintOptions), config);
  } catch (error) {
    // is this noisy? Try setting options.disableLog to false
    logger.debug('Unable to find config');
    return {
      rules: {}
    };
  }
}

function getPrettierConfig(filePath, prettierPath) {
  const prettier = (0, _utils.requireModule)(prettierPath, 'prettier');
  return prettier.resolveConfig && prettier.resolveConfig.sync && prettier.resolveConfig.sync(filePath) || {};
}

function getModulePath(filePath = __filename, moduleName) {
  try {
    return _requireRelative.default.resolve(moduleName, filePath);
  } catch (error) {
    logger.debug((0, _commonTags.oneLine)`
        There was a problem finding the ${moduleName}
        module. Using prettier-eslint's version.
      `, error.message, error.stack);
    return require.resolve(moduleName);
  }
}

function getDefaultLogLevel() {
  return process.env.LOG_LEVEL || 'warn';
}