"use strict";

var _slicedToArray2 = require("babel-runtime/helpers/slicedToArray");

var _slicedToArray3 = _interopRequireDefault(_slicedToArray2);

var _entries = require("babel-runtime/core-js/object/entries");

var _entries2 = _interopRequireDefault(_entries);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _requireRelative = require("require-relative");

var _requireRelative2 = _interopRequireDefault(_requireRelative);

var _prettyFormat = require("pretty-format");

var _prettyFormat2 = _interopRequireDefault(_prettyFormat);

var _commonTags = require("common-tags");

var _indentString = require("indent-string");

var _indentString2 = _interopRequireDefault(_indentString);

var _loglevelColoredLevelPrefix = require("loglevel-colored-level-prefix");

var _loglevelColoredLevelPrefix2 = _interopRequireDefault(_loglevelColoredLevelPrefix);

var _lodash = require("lodash.merge");

var _lodash2 = _interopRequireDefault(_lodash);

var _utils = require("./utils");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var logger = (0, _loglevelColoredLevelPrefix2.default)({ prefix: "prettier-eslint" });

// CommonJS + ES6 modules... is it worth it? Probably not...
/* eslint no-console:0, global-require:0, import/no-dynamic-require:0 */
/* eslint complexity: [1, 13] */
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
  var _options$logLevel = options.logLevel,
      logLevel = _options$logLevel === undefined ? getDefaultLogLevel() : _options$logLevel;

  logger.setLevel(logLevel);
  logger.trace("called format with options:", (0, _prettyFormat2.default)(options));

  var filePath = options.filePath,
      _options$text = options.text,
      text = _options$text === undefined ? getTextFromFilePath(filePath) : _options$text,
      _options$eslintPath = options.eslintPath,
      eslintPath = _options$eslintPath === undefined ? getModulePath(filePath, "eslint") : _options$eslintPath,
      _options$prettierPath = options.prettierPath,
      prettierPath = _options$prettierPath === undefined ? getModulePath(filePath, "prettier") : _options$prettierPath,
      prettierLast = options.prettierLast,
      fallbackPrettierOptions = options.fallbackPrettierOptions;


  var eslintConfig = (0, _lodash2.default)({}, options.eslintConfig, getESLintConfig(filePath, eslintPath));

  if (typeof eslintConfig.globals === "object") {
    eslintConfig.globals = (0, _entries2.default)(eslintConfig.globals).map(function (_ref) {
      var _ref2 = (0, _slicedToArray3.default)(_ref, 2),
          key = _ref2[0],
          value = _ref2[1];

      return `${key}:${value}`;
    });
  }

  var prettierOptions = (0, _lodash2.default)({}, filePath && { filepath: filePath }, getPrettierConfig(filePath, prettierPath), options.prettierOptions);

  var formattingOptions = (0, _utils.getOptionsForFormatting)(eslintConfig, prettierOptions, fallbackPrettierOptions, eslintPath);

  logger.debug("inferred options:", (0, _prettyFormat2.default)({
    filePath,
    text,
    eslintPath,
    prettierPath,
    eslintConfig: formattingOptions.eslint,
    prettierOptions: formattingOptions.prettier,
    logLevel,
    prettierLast
  }));

  var eslintExtensions = eslintConfig.extensions || [".js", ".jsx", ".ts", ".tsx", ".mjs", ".vue"];
  var fileExtension = _path2.default.extname(filePath || "");

  // If we don't get filePath run eslint on text, otherwise only run eslint
  // if it's a configured extension or fall back to a "supported" file type.
  var onlyPrettier = filePath ? !(eslintExtensions.indexOf(fileExtension) !== -1) : false;

  var prettify = createPrettify(formattingOptions.prettier, prettierPath);

  if (onlyPrettier) {
    return prettify(text);
  }

  if ([".ts", ".tsx"].indexOf(fileExtension) !== -1) {
    // XXX: It seems babylon is getting a TypeScript plugin.
    // Should that be used instead?
    formattingOptions.eslint.parser = require.resolve("typescript-eslint-parser");
  }

  if ([".vue"].indexOf(fileExtension) !== -1) {
    formattingOptions.eslint.parser = require.resolve("vue-eslint-parser");
  }

  var eslintFix = createEslintFix(formattingOptions.eslint, eslintPath);

  if (prettierLast) {
    return prettify(eslintFix(text, filePath));
  }
  return eslintFix(prettify(text), filePath);
}

function createPrettify(formatOptions, prettierPath) {
  return function prettify(text) {
    logger.debug("calling prettier on text");
    logger.trace(_commonTags.stripIndent`
      prettier input:

      ${(0, _indentString2.default)(text, 2)}
    `);
    var prettier = (0, _utils.requireModule)(prettierPath, "prettier");
    try {
      logger.trace(`calling prettier.format with the text and prettierOptions`);
      var output = prettier.format(text, formatOptions);
      logger.trace("prettier: output === input", output === text);
      logger.trace(_commonTags.stripIndent`
        prettier output:

        ${(0, _indentString2.default)(output, 2)}
      `);
      return output;
    } catch (error) {
      logger.error("prettier formatting failed due to a prettier error");
      throw error;
    }
  };
}

function createEslintFix(eslintConfig, eslintPath) {
  return function eslintFix(text, filePath) {
    var cliEngine = (0, _utils.getESLintCLIEngine)(eslintPath, eslintConfig);
    try {
      logger.trace(`calling cliEngine.executeOnText with the text`);
      var report = cliEngine.executeOnText(text, filePath, true);
      logger.trace(`executeOnText returned the following report:`, (0, _prettyFormat2.default)(report));
      // default the output to text because if there's nothing
      // to fix, eslint doesn't provide `output`

      var _report$results = (0, _slicedToArray3.default)(report.results, 1),
          _report$results$0$out = _report$results[0].output,
          output = _report$results$0$out === undefined ? text : _report$results$0$out;

      logger.trace("eslint --fix: output === input", output === text);
      // NOTE: We're ignoring linting errors/warnings here and
      // defaulting to the given text if there are any
      // because all we're trying to do is fix what we can.
      // We don't care about what we can't
      logger.trace(_commonTags.stripIndent`
        eslint --fix output:

        ${(0, _indentString2.default)(output, 2)}
      `);
      return output;
    } catch (error) {
      logger.error("eslint fix failed due to an eslint error");
      throw error;
    }
  };
}

function getTextFromFilePath(filePath) {
  try {
    logger.trace(_commonTags.oneLine`
        attempting fs.readFileSync to get
        the text for file at "${filePath}"
      `);
    return _fs2.default.readFileSync(filePath, "utf8");
  } catch (error) {
    logger.error(_commonTags.oneLine`
        failed to get the text to format
        from the given filePath: "${filePath}"
      `);
    throw error;
  }
}

function getESLintConfig(filePath, eslintPath) {
  var eslintOptions = {};
  if (filePath) {
    eslintOptions.cwd = _path2.default.dirname(filePath);
  }
  logger.trace(_commonTags.oneLine`
      creating ESLint CLI Engine to get the config for
      "${filePath || process.cwd()}"
    `);
  var cliEngine = (0, _utils.getESLintCLIEngine)(eslintPath, eslintOptions);
  try {
    logger.debug(`getting eslint config for file at "${filePath}"`);
    var config = cliEngine.getConfigForFile(filePath);
    logger.trace(`eslint config for "${filePath}" received`, (0, _prettyFormat2.default)(config));
    return config;
  } catch (error) {
    // is this noisy? Try setting options.disableLog to false
    logger.debug("Unable to find config");
    return { rules: {} };
  }
}

function getPrettierConfig(filePath, prettierPath) {
  var prettier = (0, _utils.requireModule)(prettierPath, "prettier");
  return prettier.resolveConfig && prettier.resolveConfig.sync && prettier.resolveConfig.sync(filePath) || {};
}

function getModulePath() {
  var filePath = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : __filename;
  var moduleName = arguments[1];

  try {
    return _requireRelative2.default.resolve(moduleName, filePath);
  } catch (error) {
    logger.debug(_commonTags.oneLine`
        There was a problem finding the ${moduleName}
        module. Using prettier-eslint's version.
      `, error.message, error.stack);
    return require.resolve(moduleName);
  }
}

function getDefaultLogLevel() {
  return process.env.LOG_LEVEL || "warn";
}