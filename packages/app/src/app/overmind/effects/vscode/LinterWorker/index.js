/* eslint-disable */
import Linter from 'eslint/lib/linter';
import semver from 'semver';

import monkeypatch from './monkeypatch-babel-eslint';

function isMinimalSemverVersion(versionOrRange, minimalVersion) {
  try {
    return !semver.gtr(minimalVersion, versionOrRange);
  } catch (e) {
    // Semver couldn't be parsed, we assume that we're on the bleeding edge now, so true.
    return true;
  }
}

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs12/browserfs.min.js`
);

// To make the parser of typescript work
process.versions.node = '10.10.0';

/* eslint-disable global-require */
const allRules = {
  'import/first': require('eslint-plugin-import/lib/rules/first'),
  'import/no-amd': require('eslint-plugin-import/lib/rules/no-amd'),
  'import/no-webpack-loader-syntax': require('eslint-plugin-import/lib/rules/no-webpack-loader-syntax'),
  'react/jsx-no-comment-textnodes': require('eslint-plugin-react_editor/lib/rules/jsx-no-comment-textnodes'),
  'react/jsx-no-duplicate-props': require('eslint-plugin-react_editor/lib/rules/jsx-no-duplicate-props'),
  'react/jsx-no-target-blank': require('eslint-plugin-react_editor/lib/rules/jsx-no-target-blank'),
  'react/jsx-no-undef': require('eslint-plugin-react_editor/lib/rules/jsx-no-undef'),
  'react/jsx-pascal-case': require('eslint-plugin-react_editor/lib/rules/jsx-pascal-case'),
  'react/jsx-uses-react': require('eslint-plugin-react_editor/lib/rules/jsx-uses-react'),
  'react/jsx-uses-vars': require('eslint-plugin-react_editor/lib/rules/jsx-uses-vars'),
  'react/no-danger-with-children': require('eslint-plugin-react_editor/lib/rules/no-danger-with-children'),
  'react/no-deprecated': require('eslint-plugin-react_editor/lib/rules/no-deprecated'),
  'react/no-direct-mutation-state': require('eslint-plugin-react_editor/lib/rules/no-direct-mutation-state'),
  'react/no-is-mounted': require('eslint-plugin-react_editor/lib/rules/no-is-mounted'),
  'react/react-in-jsx-scope': require('eslint-plugin-react_editor/lib/rules/react-in-jsx-scope'),
  'react/require-render-return': require('eslint-plugin-react_editor/lib/rules/require-render-return'),
  'react/style-prop-object': require('eslint-plugin-react_editor/lib/rules/style-prop-object'),
  'jsx-a11y/accessible-emoji': require('eslint-plugin-jsx-a11y/lib/rules/accessible-emoji'),
  'jsx-a11y/alt-text': require('eslint-plugin-jsx-a11y/lib/rules/alt-text'),
  'jsx-a11y/anchor-has-content': require('eslint-plugin-jsx-a11y/lib/rules/anchor-has-content'),
  'jsx-a11y/aria-activedescendant-has-tabindex': require('eslint-plugin-jsx-a11y/lib/rules/aria-activedescendant-has-tabindex'),
  'jsx-a11y/aria-props': require('eslint-plugin-jsx-a11y/lib/rules/aria-props'),
  'jsx-a11y/aria-proptypes': require('eslint-plugin-jsx-a11y/lib/rules/aria-proptypes'),
  'jsx-a11y/aria-role': require('eslint-plugin-jsx-a11y/lib/rules/aria-role'),
  'jsx-a11y/aria-unsupported-elements': require('eslint-plugin-jsx-a11y/lib/rules/aria-unsupported-elements'),
  'jsx-a11y/heading-has-content': require('eslint-plugin-jsx-a11y/lib/rules/heading-has-content'),
  'jsx-a11y/anchor-is-valid': require('eslint-plugin-jsx-a11y/lib/rules/anchor-is-valid'),
  'jsx-a11y/iframe-has-title': require('eslint-plugin-jsx-a11y/lib/rules/iframe-has-title'),
  'jsx-a11y/img-redundant-alt': require('eslint-plugin-jsx-a11y/lib/rules/img-redundant-alt'),
  'jsx-a11y/no-access-key': require('eslint-plugin-jsx-a11y/lib/rules/no-access-key'),
  'jsx-a11y/no-distracting-elements': require('eslint-plugin-jsx-a11y/lib/rules/no-distracting-elements'),
  'jsx-a11y/no-redundant-roles': require('eslint-plugin-jsx-a11y/lib/rules/no-redundant-roles'),
  'jsx-a11y/role-has-required-aria-props': require('eslint-plugin-jsx-a11y/lib/rules/role-has-required-aria-props'),
  'jsx-a11y/role-supports-aria-props': require('eslint-plugin-jsx-a11y/lib/rules/role-supports-aria-props'),
  'jsx-a11y/scope': require('eslint-plugin-jsx-a11y/lib/rules/scope'),
  'react-hooks/rules-of-hooks': require('eslint-plugin-react-hooks').rules[
    'rules-of-hooks'
  ],
  'react-hooks/exhaustive-deps': require('eslint-plugin-react-hooks').rules[
    'exhaustive-deps'
  ],

  '@typescript-eslint/no-array-constructor': require('@typescript-eslint/eslint-plugin/dist/rules/no-array-constructor')
    .default,
  '@typescript-eslint/no-namespace': require('@typescript-eslint/eslint-plugin/dist/rules/no-namespace')
    .default,
  '@typescript-eslint/no-unused-vars': require('@typescript-eslint/eslint-plugin/dist/rules/no-unused-vars')
    .default,
  '@typescript-eslint/no-useless-constructor': require('@typescript-eslint/eslint-plugin/dist/rules/no-useless-constructor')
    .default,
  '@typescript-eslint/no-unused-expressions': require('@typescript-eslint/eslint-plugin/dist/rules/no-unused-expressions')
    .default,
  '@typescript-eslint/no-use-before-define': require('@typescript-eslint/eslint-plugin/dist/rules/no-use-before-define')
    .default,
};
/* eslint-enable global-require */

const restrictedGlobals = [
  'addEventListener',
  'blur',
  'close',
  'closed',
  'confirm',
  'defaultStatus',
  'defaultstatus',
  'event',
  'external',
  'find',
  'focus',
  'frameElement',
  'frames',
  'history',
  'innerHeight',
  'innerWidth',
  'length',
  'location',
  'locationbar',
  'menubar',
  'moveBy',
  'moveTo',
  'name',
  'onblur',
  'onerror',
  'onfocus',
  'onload',
  'onresize',
  'onunload',
  'open',
  'opener',
  'opera',
  'outerHeight',
  'outerWidth',
  'pageXOffset',
  'pageYOffset',
  'parent',
  'print',
  'removeEventListener',
  'resizeBy',
  'resizeTo',
  'screen',
  'screenLeft',
  'screenTop',
  'screenX',
  'screenY',
  'scroll',
  'scrollbars',
  'scrollBy',
  'scrollTo',
  'scrollX',
  'scrollY',
  'self',
  'status',
  'statusbar',
  'stop',
  'toolbar',
  'top',
];

const DEFAULT_RULES = {
  // http://eslint.org/docs/rules/
  'array-callback-return': 'warn',
  'default-case': ['warn', { commentPattern: '^no default$' }],
  'dot-location': ['warn', 'property'],
  eqeqeq: ['warn', 'allow-null'],
  'new-parens': 'warn',
  'no-array-constructor': 'warn',
  'no-caller': 'warn',
  'no-cond-assign': ['warn', 'always'],
  'no-const-assign': 'warn',
  'no-control-regex': 'warn',
  'no-delete-var': 'warn',
  'no-dupe-args': 'warn',
  'no-dupe-class-members': 'warn',
  'no-dupe-keys': 'warn',
  'no-duplicate-case': 'warn',
  'no-empty-character-class': 'warn',
  'no-empty-pattern': 'warn',
  'no-eval': 'warn',
  'no-ex-assign': 'warn',
  'no-extend-native': 'warn',
  'no-extra-bind': 'warn',
  'no-extra-label': 'warn',
  'no-fallthrough': 'warn',
  'no-func-assign': 'warn',
  'no-implied-eval': 'warn',
  'no-invalid-regexp': 'warn',
  'no-iterator': 'warn',
  'no-label-var': 'warn',
  'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
  'no-lone-blocks': 'warn',
  'no-mixed-operators': [
    'warn',
    {
      groups: [
        ['&', '|', '^', '~', '<<', '>>', '>>>'],
        ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
        ['&&', '||'],
        ['in', 'instanceof'],
      ],
      allowSamePrecedence: false,
    },
  ],
  'no-multi-str': 'warn',
  'no-native-reassign': 'warn',
  'no-negated-in-lhs': 'warn',
  'no-new-func': 'warn',
  'no-new-object': 'warn',
  'no-new-symbol': 'warn',
  'no-new-wrappers': 'warn',
  'no-obj-calls': 'warn',
  'no-octal': 'warn',
  'no-octal-escape': 'warn',
  'no-redeclare': 'warn',
  'no-regex-spaces': 'warn',
  'no-restricted-syntax': ['warn', 'WithStatement'],
  'no-script-url': 'warn',
  'no-self-assign': 'warn',
  'no-self-compare': 'warn',
  'no-sequences': 'warn',
  'no-shadow-restricted-names': 'warn',
  'no-sparse-arrays': 'warn',
  'no-template-curly-in-string': 'warn',
  'no-this-before-super': 'warn',
  'no-throw-literal': 'warn',
  'no-undef': 'error',
  'no-restricted-globals': ['error'].concat(restrictedGlobals),
  'no-unexpected-multiline': 'warn',
  'no-unreachable': 'warn',
  'no-unused-expressions': [
    'warn',
    {
      allowShortCircuit: true,
      allowTernary: true,
      allowTaggedTemplates: true,
    },
  ],
  'no-unused-labels': 'warn',
  'no-unused-vars': [
    'warn',
    {
      args: 'none',
      ignoreRestSiblings: true,
    },
  ],
  'no-use-before-define': [
    'warn',
    {
      functions: false,
      classes: false,
      variables: false,
    },
  ],
  'no-useless-computed-key': 'warn',
  'no-useless-concat': 'warn',
  'no-useless-constructor': 'warn',
  'no-useless-escape': 'warn',
  'no-useless-rename': [
    'warn',
    {
      ignoreDestructuring: false,
      ignoreImport: false,
      ignoreExport: false,
    },
  ],
  'no-with': 'warn',
  'no-whitespace-before-property': 'warn',
  radix: 'warn',
  'require-yield': 'warn',
  'rest-spread-spacing': ['warn', 'never'],
  strict: ['warn', 'never'],
  'unicode-bom': ['warn', 'never'],
  'use-isnan': 'warn',
  'valid-typeof': 'warn',
  'no-restricted-properties': [
    'error',
    // TODO: reenable once import() is no longer slow.
    // https://github.com/facebookincubator/create-react-app/issues/2176
    // {
    //   object: 'require',
    //   property: 'ensure',
    //   message: 'Please use import() instead. More info: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting',
    // },
    {
      object: 'System',
      property: 'import',
      message:
        'Please use import() instead. More info: https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md#code-splitting',
    },
  ],

  // https://github.com/benmosher/eslint-plugin-import/tree/master/docs/rules
  'import/first': 'error',
  'import/no-amd': 'error',
  'import/no-webpack-loader-syntax': 'warn',

  // https://github.com/yannickcr/eslint-plugin-react_editor/tree/master/docs/rules
  'react/jsx-no-comment-textnodes': 'warn',
  'react/jsx-no-duplicate-props': ['warn', { ignoreCase: true }],
  'react/jsx-no-target-blank': 'warn',
  'react/jsx-no-undef': 'error',
  'react/jsx-pascal-case': [
    'warn',
    {
      allowAllCaps: true,
      allowNamespace: true,
      ignore: [],
    },
  ],
  'react/jsx-uses-react': 'warn',
  'react/jsx-uses-vars': 'warn',
  'react/no-danger-with-children': 'warn',
  'react/no-deprecated': 'warn',
  'react/no-direct-mutation-state': 'warn',
  'react/no-is-mounted': 'warn',
  // 'react/react-in-jsx-scope': 'error',
  'react/require-render-return': 'error',
  'react/style-prop-object': 'warn',
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'warn',

  // https://github.com/evcohen/eslint-plugin-jsx-a11y/tree/master/docs/rules
  'jsx-a11y/accessible-emoji': 'warn',
  'jsx-a11y/alt-text': 'warn',
  'jsx-a11y/anchor-has-content': 'warn',
  'jsx-a11y/anchor-is-valid': [
    'warn',
    {
      aspects: ['noHref', 'invalidHref'],
    },
  ],
  'jsx-a11y/aria-activedescendant-has-tabindex': 'warn',
  'jsx-a11y/aria-props': 'warn',
  'jsx-a11y/aria-proptypes': 'warn',
  'jsx-a11y/aria-role': 'warn',
  'jsx-a11y/aria-unsupported-elements': 'warn',
  'jsx-a11y/heading-has-content': 'warn',
  'jsx-a11y/iframe-has-title': 'warn',
  'jsx-a11y/img-redundant-alt': 'warn',
  'jsx-a11y/no-access-key': 'warn',
  'jsx-a11y/no-distracting-elements': 'warn',
  'jsx-a11y/no-redundant-roles': 'warn',
  'jsx-a11y/role-has-required-aria-props': 'warn',
  'jsx-a11y/role-supports-aria-props': 'warn',
  'jsx-a11y/scope': 'warn',
};

const DEFAULT_ENV = {
  browser: true,
  commonjs: true,
  es6: true,
  jest: true,
  node: true,
};

const TYPESCRIPT_PARSER_OPTIONS = {
  parser: '@typescript-eslint/parser',
  env: DEFAULT_ENV,
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },

    // typescript-eslint specific options
    warnOnUnsupportedTypeScriptVersion: true,
  },
  plugins: ['@typescript-eslint'],
  // If adding a typescript-eslint version of an existing ESLint rule,
  // make sure to disable the ESLint rule here.
  rules: {
    ...DEFAULT_RULES,
    // TypeScript's `noFallthroughCasesInSwitch` option is more robust (#6906)
    'default-case': 'off',
    // 'tsc' already handles this (https://github.com/typescript-eslint/typescript-eslint/issues/291)
    'no-dupe-class-members': 'off',

    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'warn',
    '@typescript-eslint/no-namespace': 'error',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        args: 'none',
        ignoreRestSiblings: true,
      },
    ],
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'warn',
    // Fixes optional chaining
    'no-unused-expressions': 'off',
    '@typescript-eslint/no-unused-expressions': 'warn',
    // note you must disable the base rule as it can report incorrect errors
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': 'error',
    /**
     * Off because this gives false positive errors when using global namespace types like `JSX.*`
     * @link https://github.com/typescript-eslint/typescript-eslint/blob/master/docs/getting-started/linting/FAQ.md#i-get-errors-from-the-no-undef-rule-about-global-variables-not-being-defined-even-though-there-are-no-typescript-errors
     */
    'no-undef': 'off',
  },
};

const defaultConfig = {
  parserOptions: {
    ecmaVersion: 8,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
      globalReturn: false,
      impliedStrict: true,
      experimentalObjectRestSpread: true,
      modules: true,
    },
  },
  parser: 'babel-eslint',
  env: DEFAULT_ENV,
  rules: DEFAULT_RULES,
};

monkeypatch({}, defaultConfig.parserOptions);

const linter = new Linter();

/**
 * Some code in eslint (specifically vue parser) still uses require(loaderOptions.parser) to get the parser,
 * we now rewrite that code to globalRequire(loaderOptions.parser), and make sure to return it here if the parser
 * has been defined already.
 */

const definedParsers = new Map();
const oldDefine = linter.defineParser;
linter.defineParser = (parserName, parser) => {
  definedParsers.set(parserName, parser);
  oldDefine.apply(linter, [parserName, parser]);
};
self.globalRequire = path => {
  if (definedParsers.get(path)) {
    return definedParsers.get(path);
  }
  throw new Error('Module ' + path + ' not found in global require.');
};

linter.defineParser(
  'babel-eslint',
  require('babel-eslint') // eslint-disable-line global-require
);

linter.defineParser(
  '@typescript-eslint/parser',
  require('@typescript-eslint/parser') // eslint-disable-line global-require
);

linter.defineRules(allRules);

function getPos(error) {
  const { line, column, endLine, endColumn } = error;

  return { line, column, endLine, endColumn };
}

function getSeverity(error) {
  switch (error.severity) {
    case 1:
      return 2;
    case 2:
      return 3;
    default:
      return 3;
  }
}

// Respond to message from parent thread
self.addEventListener('message', async event => {
  const { code, version, title: filename, template, dependencies } = event.data;

  let config =
    filename.endsWith('.ts') || filename.endsWith('.tsx')
      ? TYPESCRIPT_PARSER_OPTIONS
      : defaultConfig;
  let options = { filename };

  if (template === 'vue-cli' || template === 'nuxt') {
    const {
      getConfig: getVueConfig,
      getVerifyOptions: getVueVerifyOptions,
    } = await import('./vue');

    config = await getVueConfig(
      linter,
      !isMinimalSemverVersion(dependencies.vue || '2.0.0', '3.0.0')
    );
    config.rules = {
      ...defaultConfig.rules,
      ...config.rules,
      'react-hooks/rules-of-hooks': 'off',
    };
    options = { ...options, ...getVueVerifyOptions(filename) };
  }

  const validations = linter.verify(code, config, options);

  const markers = validations.map(error => {
    const {
      line: startL,
      column: startCol,
      endLine: endL,
      endColumn: endCol,
    } = getPos(error, true);

    return {
      severity: getSeverity(error),
      startColumn: startCol,
      startLineNumber: startL,
      endColumn: endCol,
      endLineNumber: endL,
      message: `${error.message} (${error.ruleId})`,
      source: 'eslint',
    };
  });

  self.postMessage({ markers, version });
});
