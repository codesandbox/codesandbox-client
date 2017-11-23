module.exports = function loadRules() {
  var rules = Object.create(null);
  // Create list of require statements of all rules during compile time

  rules['accessor-pairs'] = require('eslint/lib/rules/accessor-pairs');
  rules[
    'array-bracket-spacing'
  ] = require('eslint/lib/rules/array-bracket-spacing');
  rules[
    'array-callback-return'
  ] = require('eslint/lib/rules/array-callback-return');
  rules['arrow-body-style'] = require('eslint/lib/rules/arrow-body-style');
  rules['arrow-parens'] = require('eslint/lib/rules/arrow-parens');
  rules['arrow-spacing'] = require('eslint/lib/rules/arrow-spacing');
  rules['block-scoped-var'] = require('eslint/lib/rules/block-scoped-var');
  rules['block-spacing'] = require('eslint/lib/rules/block-spacing');
  rules['brace-style'] = require('eslint/lib/rules/brace-style');
  rules['callback-return'] = require('eslint/lib/rules/callback-return');
  rules['camelcase'] = require('eslint/lib/rules/camelcase');
  rules[
    'capitalized-comments'
  ] = require('eslint/lib/rules/capitalized-comments');
  rules[
    'class-methods-use-this'
  ] = require('eslint/lib/rules/class-methods-use-this');
  rules['comma-dangle'] = require('eslint/lib/rules/comma-dangle');
  rules['comma-spacing'] = require('eslint/lib/rules/comma-spacing');
  rules['comma-style'] = require('eslint/lib/rules/comma-style');
  rules['complexity'] = require('eslint/lib/rules/complexity');
  rules[
    'computed-property-spacing'
  ] = require('eslint/lib/rules/computed-property-spacing');
  rules['consistent-return'] = require('eslint/lib/rules/consistent-return');
  rules['consistent-this'] = require('eslint/lib/rules/consistent-this');
  rules['constructor-super'] = require('eslint/lib/rules/constructor-super');
  rules['curly'] = require('eslint/lib/rules/curly');
  rules['default-case'] = require('eslint/lib/rules/default-case');
  rules['dot-location'] = require('eslint/lib/rules/dot-location');
  rules['dot-notation'] = require('eslint/lib/rules/dot-notation');
  rules['eol-last'] = require('eslint/lib/rules/eol-last');
  rules['eqeqeq'] = require('eslint/lib/rules/eqeqeq');
  rules['func-call-spacing'] = require('eslint/lib/rules/func-call-spacing');
  rules['func-name-matching'] = require('eslint/lib/rules/func-name-matching');
  rules['func-names'] = require('eslint/lib/rules/func-names');
  rules['func-style'] = require('eslint/lib/rules/func-style');
  rules[
    'generator-star-spacing'
  ] = require('eslint/lib/rules/generator-star-spacing');
  rules['global-require'] = require('eslint/lib/rules/global-require');
  rules['guard-for-in'] = require('eslint/lib/rules/guard-for-in');
  rules[
    'handle-callback-err'
  ] = require('eslint/lib/rules/handle-callback-err');
  rules['id-blacklist'] = require('eslint/lib/rules/id-blacklist');
  rules['id-length'] = require('eslint/lib/rules/id-length');
  rules['id-match'] = require('eslint/lib/rules/id-match');
  rules['indent'] = require('eslint/lib/rules/indent');
  rules['init-declarations'] = require('eslint/lib/rules/init-declarations');
  rules['jsx-quotes'] = require('eslint/lib/rules/jsx-quotes');
  rules['key-spacing'] = require('eslint/lib/rules/key-spacing');
  rules['keyword-spacing'] = require('eslint/lib/rules/keyword-spacing');
  rules[
    'line-comment-position'
  ] = require('eslint/lib/rules/line-comment-position');
  rules['linebreak-style'] = require('eslint/lib/rules/linebreak-style');
  rules[
    'lines-around-comment'
  ] = require('eslint/lib/rules/lines-around-comment');
  rules[
    'lines-around-directive'
  ] = require('eslint/lib/rules/lines-around-directive');
  rules['max-depth'] = require('eslint/lib/rules/max-depth');
  rules['max-len'] = require('eslint/lib/rules/max-len');
  rules['max-lines'] = require('eslint/lib/rules/max-lines');
  rules[
    'max-nested-callbacks'
  ] = require('eslint/lib/rules/max-nested-callbacks');
  rules['max-params'] = require('eslint/lib/rules/max-params');
  rules[
    'max-statements-per-line'
  ] = require('eslint/lib/rules/max-statements-per-line');
  rules['max-statements'] = require('eslint/lib/rules/max-statements');
  rules['multiline-ternary'] = require('eslint/lib/rules/multiline-ternary');
  rules['new-cap'] = require('eslint/lib/rules/new-cap');
  rules['new-parens'] = require('eslint/lib/rules/new-parens');
  rules['newline-after-var'] = require('eslint/lib/rules/newline-after-var');
  rules[
    'newline-before-return'
  ] = require('eslint/lib/rules/newline-before-return');
  rules[
    'newline-per-chained-call'
  ] = require('eslint/lib/rules/newline-per-chained-call');
  rules['no-alert'] = require('eslint/lib/rules/no-alert');
  rules[
    'no-array-constructor'
  ] = require('eslint/lib/rules/no-array-constructor');
  rules['no-await-in-loop'] = require('eslint/lib/rules/no-await-in-loop');
  rules['no-bitwise'] = require('eslint/lib/rules/no-bitwise');
  rules['no-caller'] = require('eslint/lib/rules/no-caller');
  rules[
    'no-case-declarations'
  ] = require('eslint/lib/rules/no-case-declarations');
  rules['no-catch-shadow'] = require('eslint/lib/rules/no-catch-shadow');
  rules['no-class-assign'] = require('eslint/lib/rules/no-class-assign');
  rules[
    'no-compare-neg-zero'
  ] = require('eslint/lib/rules/no-compare-neg-zero');
  rules['no-cond-assign'] = require('eslint/lib/rules/no-cond-assign');
  rules['no-confusing-arrow'] = require('eslint/lib/rules/no-confusing-arrow');
  rules['no-console'] = require('eslint/lib/rules/no-console');
  rules['no-const-assign'] = require('eslint/lib/rules/no-const-assign');
  rules[
    'no-constant-condition'
  ] = require('eslint/lib/rules/no-constant-condition');
  rules['no-continue'] = require('eslint/lib/rules/no-continue');
  rules['no-control-regex'] = require('eslint/lib/rules/no-control-regex');
  rules['no-debugger'] = require('eslint/lib/rules/no-debugger');
  rules['no-delete-var'] = require('eslint/lib/rules/no-delete-var');
  rules['no-div-regex'] = require('eslint/lib/rules/no-div-regex');
  rules['no-dupe-args'] = require('eslint/lib/rules/no-dupe-args');
  rules[
    'no-dupe-class-members'
  ] = require('eslint/lib/rules/no-dupe-class-members');
  rules['no-dupe-keys'] = require('eslint/lib/rules/no-dupe-keys');
  rules['no-duplicate-case'] = require('eslint/lib/rules/no-duplicate-case');
  rules[
    'no-duplicate-imports'
  ] = require('eslint/lib/rules/no-duplicate-imports');
  rules['no-else-return'] = require('eslint/lib/rules/no-else-return');
  rules[
    'no-empty-character-class'
  ] = require('eslint/lib/rules/no-empty-character-class');
  rules['no-empty-function'] = require('eslint/lib/rules/no-empty-function');
  rules['no-empty-pattern'] = require('eslint/lib/rules/no-empty-pattern');
  rules['no-empty'] = require('eslint/lib/rules/no-empty');
  rules['no-eq-null'] = require('eslint/lib/rules/no-eq-null');
  rules['no-eval'] = require('eslint/lib/rules/no-eval');
  rules['no-ex-assign'] = require('eslint/lib/rules/no-ex-assign');
  rules['no-extend-native'] = require('eslint/lib/rules/no-extend-native');
  rules['no-extra-bind'] = require('eslint/lib/rules/no-extra-bind');
  rules[
    'no-extra-boolean-cast'
  ] = require('eslint/lib/rules/no-extra-boolean-cast');
  rules['no-extra-label'] = require('eslint/lib/rules/no-extra-label');
  rules['no-extra-parens'] = require('eslint/lib/rules/no-extra-parens');
  rules['no-extra-semi'] = require('eslint/lib/rules/no-extra-semi');
  rules['no-fallthrough'] = require('eslint/lib/rules/no-fallthrough');
  rules[
    'no-floating-decimal'
  ] = require('eslint/lib/rules/no-floating-decimal');
  rules['no-func-assign'] = require('eslint/lib/rules/no-func-assign');
  rules['no-global-assign'] = require('eslint/lib/rules/no-global-assign');
  rules[
    'no-implicit-coercion'
  ] = require('eslint/lib/rules/no-implicit-coercion');
  rules[
    'no-implicit-globals'
  ] = require('eslint/lib/rules/no-implicit-globals');
  rules['no-implied-eval'] = require('eslint/lib/rules/no-implied-eval');
  rules['no-inline-comments'] = require('eslint/lib/rules/no-inline-comments');
  rules[
    'no-inner-declarations'
  ] = require('eslint/lib/rules/no-inner-declarations');
  rules['no-invalid-regexp'] = require('eslint/lib/rules/no-invalid-regexp');
  rules['no-invalid-this'] = require('eslint/lib/rules/no-invalid-this');
  rules[
    'no-irregular-whitespace'
  ] = require('eslint/lib/rules/no-irregular-whitespace');
  rules['no-iterator'] = require('eslint/lib/rules/no-iterator');
  rules['no-label-var'] = require('eslint/lib/rules/no-label-var');
  rules['no-labels'] = require('eslint/lib/rules/no-labels');
  rules['no-lone-blocks'] = require('eslint/lib/rules/no-lone-blocks');
  rules['no-lonely-if'] = require('eslint/lib/rules/no-lonely-if');
  rules['no-loop-func'] = require('eslint/lib/rules/no-loop-func');
  rules['no-magic-numbers'] = require('eslint/lib/rules/no-magic-numbers');
  rules['no-mixed-operators'] = require('eslint/lib/rules/no-mixed-operators');
  rules['no-mixed-requires'] = require('eslint/lib/rules/no-mixed-requires');
  rules[
    'no-mixed-spaces-and-tabs'
  ] = require('eslint/lib/rules/no-mixed-spaces-and-tabs');
  rules['no-multi-assign'] = require('eslint/lib/rules/no-multi-assign');
  rules['no-multi-spaces'] = require('eslint/lib/rules/no-multi-spaces');
  rules['no-multi-str'] = require('eslint/lib/rules/no-multi-str');
  rules[
    'no-multiple-empty-lines'
  ] = require('eslint/lib/rules/no-multiple-empty-lines');
  rules['no-native-reassign'] = require('eslint/lib/rules/no-native-reassign');
  rules[
    'no-negated-condition'
  ] = require('eslint/lib/rules/no-negated-condition');
  rules['no-negated-in-lhs'] = require('eslint/lib/rules/no-negated-in-lhs');
  rules['no-nested-ternary'] = require('eslint/lib/rules/no-nested-ternary');
  rules['no-new-func'] = require('eslint/lib/rules/no-new-func');
  rules['no-new-object'] = require('eslint/lib/rules/no-new-object');
  rules['no-new-require'] = require('eslint/lib/rules/no-new-require');
  rules['no-new-symbol'] = require('eslint/lib/rules/no-new-symbol');
  rules['no-new-wrappers'] = require('eslint/lib/rules/no-new-wrappers');
  rules['no-new'] = require('eslint/lib/rules/no-new');
  rules['no-obj-calls'] = require('eslint/lib/rules/no-obj-calls');
  rules['no-octal-escape'] = require('eslint/lib/rules/no-octal-escape');
  rules['no-octal'] = require('eslint/lib/rules/no-octal');
  rules['no-param-reassign'] = require('eslint/lib/rules/no-param-reassign');
  rules['no-path-concat'] = require('eslint/lib/rules/no-path-concat');
  rules['no-plusplus'] = require('eslint/lib/rules/no-plusplus');
  rules['no-process-env'] = require('eslint/lib/rules/no-process-env');
  rules['no-process-exit'] = require('eslint/lib/rules/no-process-exit');
  rules['no-proto'] = require('eslint/lib/rules/no-proto');
  rules[
    'no-prototype-builtins'
  ] = require('eslint/lib/rules/no-prototype-builtins');
  rules['no-redeclare'] = require('eslint/lib/rules/no-redeclare');
  rules['no-regex-spaces'] = require('eslint/lib/rules/no-regex-spaces');
  rules[
    'no-restricted-globals'
  ] = require('eslint/lib/rules/no-restricted-globals');
  rules[
    'no-restricted-imports'
  ] = require('eslint/lib/rules/no-restricted-imports');
  rules[
    'no-restricted-modules'
  ] = require('eslint/lib/rules/no-restricted-modules');
  rules[
    'no-restricted-properties'
  ] = require('eslint/lib/rules/no-restricted-properties');
  rules[
    'no-restricted-syntax'
  ] = require('eslint/lib/rules/no-restricted-syntax');
  rules['no-return-assign'] = require('eslint/lib/rules/no-return-assign');
  rules['no-return-await'] = require('eslint/lib/rules/no-return-await');
  rules['no-script-url'] = require('eslint/lib/rules/no-script-url');
  rules['no-self-assign'] = require('eslint/lib/rules/no-self-assign');
  rules['no-self-compare'] = require('eslint/lib/rules/no-self-compare');
  rules['no-sequences'] = require('eslint/lib/rules/no-sequences');
  rules[
    'no-shadow-restricted-names'
  ] = require('eslint/lib/rules/no-shadow-restricted-names');
  rules['no-shadow'] = require('eslint/lib/rules/no-shadow');
  rules['no-spaced-func'] = require('eslint/lib/rules/no-spaced-func');
  rules['no-sparse-arrays'] = require('eslint/lib/rules/no-sparse-arrays');
  rules['no-sync'] = require('eslint/lib/rules/no-sync');
  rules['no-tabs'] = require('eslint/lib/rules/no-tabs');
  rules[
    'no-template-curly-in-string'
  ] = require('eslint/lib/rules/no-template-curly-in-string');
  rules['no-ternary'] = require('eslint/lib/rules/no-ternary');
  rules[
    'no-this-before-super'
  ] = require('eslint/lib/rules/no-this-before-super');
  rules['no-throw-literal'] = require('eslint/lib/rules/no-throw-literal');
  rules['no-trailing-spaces'] = require('eslint/lib/rules/no-trailing-spaces');
  rules['no-undef-init'] = require('eslint/lib/rules/no-undef-init');
  rules['no-undef'] = require('eslint/lib/rules/no-undef');
  rules['no-undefined'] = require('eslint/lib/rules/no-undefined');
  rules[
    'no-underscore-dangle'
  ] = require('eslint/lib/rules/no-underscore-dangle');
  rules[
    'no-unexpected-multiline'
  ] = require('eslint/lib/rules/no-unexpected-multiline');
  rules[
    'no-unmodified-loop-condition'
  ] = require('eslint/lib/rules/no-unmodified-loop-condition');
  rules[
    'no-unneeded-ternary'
  ] = require('eslint/lib/rules/no-unneeded-ternary');
  rules['no-unreachable'] = require('eslint/lib/rules/no-unreachable');
  rules['no-unsafe-finally'] = require('eslint/lib/rules/no-unsafe-finally');
  rules['no-unsafe-negation'] = require('eslint/lib/rules/no-unsafe-negation');
  rules[
    'no-unused-expressions'
  ] = require('eslint/lib/rules/no-unused-expressions');
  rules['no-unused-labels'] = require('eslint/lib/rules/no-unused-labels');
  rules['no-unused-vars'] = require('eslint/lib/rules/no-unused-vars');
  rules[
    'no-use-before-define'
  ] = require('eslint/lib/rules/no-use-before-define');
  rules['no-useless-call'] = require('eslint/lib/rules/no-useless-call');
  rules[
    'no-useless-computed-key'
  ] = require('eslint/lib/rules/no-useless-computed-key');
  rules['no-useless-concat'] = require('eslint/lib/rules/no-useless-concat');
  rules[
    'no-useless-constructor'
  ] = require('eslint/lib/rules/no-useless-constructor');
  rules['no-useless-escape'] = require('eslint/lib/rules/no-useless-escape');
  rules['no-useless-rename'] = require('eslint/lib/rules/no-useless-rename');
  rules['no-useless-return'] = require('eslint/lib/rules/no-useless-return');
  rules['no-var'] = require('eslint/lib/rules/no-var');
  rules['no-void'] = require('eslint/lib/rules/no-void');
  rules[
    'no-warning-comments'
  ] = require('eslint/lib/rules/no-warning-comments');
  rules[
    'no-whitespace-before-property'
  ] = require('eslint/lib/rules/no-whitespace-before-property');
  rules['no-with'] = require('eslint/lib/rules/no-with');
  rules[
    'nonblock-statement-body-position'
  ] = require('eslint/lib/rules/nonblock-statement-body-position');
  rules[
    'object-curly-newline'
  ] = require('eslint/lib/rules/object-curly-newline');
  rules[
    'object-curly-spacing'
  ] = require('eslint/lib/rules/object-curly-spacing');
  rules[
    'object-property-newline'
  ] = require('eslint/lib/rules/object-property-newline');
  rules['object-shorthand'] = require('eslint/lib/rules/object-shorthand');
  rules[
    'one-var-declaration-per-line'
  ] = require('eslint/lib/rules/one-var-declaration-per-line');
  rules['one-var'] = require('eslint/lib/rules/one-var');
  rules[
    'operator-assignment'
  ] = require('eslint/lib/rules/operator-assignment');
  rules['operator-linebreak'] = require('eslint/lib/rules/operator-linebreak');
  rules['padded-blocks'] = require('eslint/lib/rules/padded-blocks');
  rules[
    'prefer-arrow-callback'
  ] = require('eslint/lib/rules/prefer-arrow-callback');
  rules['prefer-const'] = require('eslint/lib/rules/prefer-const');
  rules[
    'prefer-destructuring'
  ] = require('eslint/lib/rules/prefer-destructuring');
  rules[
    'prefer-numeric-literals'
  ] = require('eslint/lib/rules/prefer-numeric-literals');
  rules[
    'prefer-promise-reject-errors'
  ] = require('eslint/lib/rules/prefer-promise-reject-errors');
  rules['prefer-reflect'] = require('eslint/lib/rules/prefer-reflect');
  rules['prefer-rest-params'] = require('eslint/lib/rules/prefer-rest-params');
  rules['prefer-spread'] = require('eslint/lib/rules/prefer-spread');
  rules['prefer-template'] = require('eslint/lib/rules/prefer-template');
  rules['quote-props'] = require('eslint/lib/rules/quote-props');
  rules['quotes'] = require('eslint/lib/rules/quotes');
  rules['radix'] = require('eslint/lib/rules/radix');
  rules['require-await'] = require('eslint/lib/rules/require-await');
  rules['require-jsdoc'] = require('eslint/lib/rules/require-jsdoc');
  rules['require-yield'] = require('eslint/lib/rules/require-yield');
  rules[
    'rest-spread-spacing'
  ] = require('eslint/lib/rules/rest-spread-spacing');
  rules['semi-spacing'] = require('eslint/lib/rules/semi-spacing');
  rules['semi'] = require('eslint/lib/rules/semi');
  rules['sort-imports'] = require('eslint/lib/rules/sort-imports');
  rules['sort-keys'] = require('eslint/lib/rules/sort-keys');
  rules['sort-vars'] = require('eslint/lib/rules/sort-vars');
  rules[
    'space-before-blocks'
  ] = require('eslint/lib/rules/space-before-blocks');
  rules[
    'space-before-function-paren'
  ] = require('eslint/lib/rules/space-before-function-paren');
  rules['space-in-parens'] = require('eslint/lib/rules/space-in-parens');
  rules['space-infix-ops'] = require('eslint/lib/rules/space-infix-ops');
  rules['space-unary-ops'] = require('eslint/lib/rules/space-unary-ops');
  rules['spaced-comment'] = require('eslint/lib/rules/spaced-comment');
  rules['strict'] = require('eslint/lib/rules/strict');
  rules['symbol-description'] = require('eslint/lib/rules/symbol-description');
  rules[
    'template-curly-spacing'
  ] = require('eslint/lib/rules/template-curly-spacing');
  rules[
    'template-tag-spacing'
  ] = require('eslint/lib/rules/template-tag-spacing');
  rules['unicode-bom'] = require('eslint/lib/rules/unicode-bom');
  rules['use-isnan'] = require('eslint/lib/rules/use-isnan');
  rules['valid-jsdoc'] = require('eslint/lib/rules/valid-jsdoc');
  rules['valid-typeof'] = require('eslint/lib/rules/valid-typeof');
  rules['vars-on-top'] = require('eslint/lib/rules/vars-on-top');
  rules['wrap-iife'] = require('eslint/lib/rules/wrap-iife');
  rules['wrap-regex'] = require('eslint/lib/rules/wrap-regex');
  rules['yield-star-spacing'] = require('eslint/lib/rules/yield-star-spacing');
  rules['yoda'] = require('eslint/lib/rules/yoda');
  return rules;
};
