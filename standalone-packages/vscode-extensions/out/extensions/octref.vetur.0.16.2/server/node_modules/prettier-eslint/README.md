# prettier-eslint

Formats your JavaScript using [`prettier`][prettier] followed by [`eslint --fix`][eslint]

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package] [![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][license]

[![All Contributors](https://img.shields.io/badge/all_contributors-24-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs] [![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc] [![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

The [`fix`][fix] feature of [`eslint`][eslint] is pretty great and can
auto-format/fix much of your code according to your ESLint config.
[`prettier`][prettier] is a more powerful automatic formatter. One of the nice
things about prettier is how opinionated it is. Unfortunately it's not
opinionated enough and/or some opinions differ from my own. So after prettier
formats the code, I start getting linting errors.

## This solution

This formats your code via `prettier`, and then passes the result of that to
`eslint --fix`. This way you can get the benefits of `prettier`'s superior
formatting capabilities, but also benefit from the configuration capabilities of
`eslint`.

> For files with an extension of `.css`, `.less`, `.scss`, or `.json` this only
> runs `prettier` since `eslint` cannot process those.

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and
should be installed as one of your project's `devDependencies`:

```
npm install --save-dev prettier-eslint
```

## Usage

### Example

```javascript
const format = require("prettier-eslint");

// notice, no semicolon in the original text
const sourceCode = "const {foo} = bar";

const options = {
  text: sourceCode,
  eslintConfig: {
    parserOptions: {
      ecmaVersion: 7
    },
    rules: {
      semi: ["error", "never"]
    }
  },
  prettierOptions: {
    bracketSpacing: true
  },
  fallbackPrettierOptions: {
    singleQuote: false
  }
};

const formatted = format(options);

// notice no semicolon in the formatted text
formatted; // const { foo } = bar
```

### options

#### text (String)

The source code to format.

#### filePath (?String)

The path of the file being formatted can be used to override `eslintConfig`
(eslint will be used to find the relevant config for the file).

#### eslintConfig (?Object)

The config to use for formatting with ESLint. Can be overridden with `filePath`.

#### prettierOptions (?Object)

The options to pass for formatting with `prettier`. If not provided,
`prettier-eslint` will attempt to create the options based on the `eslintConfig`
(whether that's provided or derived via `filePath`). You can also provide _some_
of the options and have the remaining options derived via your eslint config.
This is useful for options like `parser`.

**NOTE:** these options _override_ the eslint config. If you want fallback
options to be used only in the case that the rule cannot be inferred from
eslint, see "fallbackPrettierOptions" below.

#### fallbackPrettierOptions (?Object)

The options to pass for formatting with `prettier` if `prettier-eslint` is not
able to create the options based on the the `eslintConfig` (whether that's
provided or derived via `filePath`). These options will only be used in the case
that the corresponding eslint rule cannot be found and the prettier option has
not been manually defined in `prettierOptions`. If the fallback is not given,
`prettier-eslint` will just use the default `prettier` value in this scenario.

#### logLevel (?Enum: ['trace', 'debug', 'info', 'warn', 'error', 'silent'])

`prettier-eslint` does quite a bit of logging if you want it to. Pass this to
set the amount of logs you want to see. Default is `process.env.LOG_LEVEL || 'warn'`.

#### eslintPath (?String)

By default, `prettier-eslint` will try to find the relevant `eslint` (and
`prettier`) module based on the `filePath`. If it cannot find one, then it will
use the version that `prettier-eslint` has installed locally. If you'd like to
specify a path to the `eslint` module you would like to have `prettier-eslint`
use, then you can provide the full path to it with the `eslintPath` option.

#### prettierPath (?String)

This is basically the same as `eslintPath` except for the `prettier` module.

#### prettierLast (?Boolean)

By default, `prettier-eslint` will run `prettier` first, then `eslint --fix`.
This is great if you want to use `prettier`, but override some of the styles you
don't like using `eslint --fix`.

An alternative approach is to use different tools for different concerns. If you
provide `prettierLast: true`, it will run `eslint --fix` first, then `prettier`.
This allows you to use `eslint` to look for bugs and/or bad practices, and use
`prettier` to enforce code style.

### throws

`prettier-eslint` will **only** propagate _parsing_ errors when either `prettier` or `eslint` fails. In addition to propagating the errors, it will also log a specific message indicating what it was doing at the time of the failure.

**Note:** `prettier-eslint` will not show any message regarding broken rules in either `prettier` or `eslint`.

## Technical details

> Code ➡️ prettier ➡️ eslint --fix ➡️ Formatted Code ✨

### inferring prettierOptions via eslintConfig

The `eslintConfig` and `prettierOptions` can each be provided as an argument. If
the `eslintConfig` is not provided, then `prettier-eslint` will look for them
based on the `fileName` (if no `fileName` is provided then it uses
`process.cwd()`). Once `prettier-eslint` has found the `eslintConfig`, the
`prettierOptions` are inferred from the `eslintConfig`. If some of the
`prettierOptions` have already been provided, then `prettier-eslint` will only
infer the remaining options. This inference happens in `src/utils.js`.

**An important thing to note** about this inference is that it may not support
your specific eslint config. So you'll want to check `src/utils.js` to see how
the inference is done for each option (what rule(s) are referenced, etc.) and
[make a pull request][prs] if your configuration is supported.

**Defaults** if you have all of the relevant ESLint rules disabled (or have
ESLint disabled entirely via `/* eslint-disable */` then prettier options will
fall back to the `prettier` defaults:

```javascript
{
  printWidth: 80,
  tabWidth: 2,
  singleQuote: false,
  trailingComma: 'none',
  bracketSpacing: true,
  semi: true,
  useTabs: false,
  // prettier-eslint doesn't currently support
  // inferring these two (Pull Requests welcome):
  parser: 'babylon',
  jsxBracketSameLine: false,
}
```

## Troubleshooting

### debugging issues

There is a lot of logging available with `prettier-eslint`. When debugging, you
can use one of the
[`logLevel`](#loglevel-enum-trace-debug-info-warn-error-silent)s to get a better
idea of what's going on. If you're using `prettier-eslint-cli` then you can use
the `--log-level trace`, if you're using [the Atom plugin][atom-plugin], then
you can [open the developer tools][atom-dev-tools] and enter:
`process.env.LOG_LEVEL = 'trace'` in the console, then run the format. You'll
see a bunch of logs that should help you determine whether the problem is
`prettier`, `eslint --fix`, how `prettier-eslint` infers your `prettier`
options, or any number of other things. You will be asked to do this before
filing issues, so please do :smile:

> NOTE: When you're doing this, it's recommended that you only run this on a
> single file because there are a LOT of logs :)

### eslint-disable-line

While using `// eslint-disable-line`, sometimes you may get linting errors after
the code has been processed by this module. That is because `prettier` changes
this:

```js
// prettier-ignore
if (x) { // eslint-disable-line
}
```

to this:

```js
if (x) {
  // eslint-disable-line
}
```

And the `eslint --fix` wont change it back. You can notice that `// eslint-disable-line` has moved to a new line. To work around this issue, you can
use `//eslint-disable-next-line` instead of `// eslint-disable-line` like this:

```js
// eslint-disable-next-line
if (x) {
}
```

## Inspiration

- [`prettier`][prettier]
- [`eslint`][eslint]

## Other Solutions

None that I'm aware of. Feel free to file a PR if you know of any other
solutions.

## Related

- [`prettier-eslint-cli`](https://github.com/prettier/prettier-eslint-cli) -
  Command Line Interface
- [`prettier-atom`][atom-plugin] - Atom plugin (check the "ESlint integration"
  checkbox in settings)
- [`prettier-vscode`][vscode-plugin] - Visual Studio Code plugin (set
  `prettier.eslintIntegration: true` in settings)
- [`eslint-plugin-prettier`](https://github.com/not-an-aardvark/eslint-plugin-prettier) -
  ESLint plugin. While prettier-eslint uses `eslint --fix` to change the output
  of `prettier`, eslint-plugin-prettier keeps the `prettier` output as-is and
  integrates it with the regular ESLint workflow.
- [`prettier-eslint-webpack-plugin`](https://github.com/danielterwiel/prettier-eslint-webpack-plugin) -
  Prettier ESlint Webpack Plugin

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub><b>Kent C. Dodds</b></sub>](https://kentcdodds.com)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=kentcdodds "Code") [📖](https://github.com/prettier/prettier-eslint/commits?author=kentcdodds "Documentation") [🚇](#infra-kentcdodds "Infrastructure (Hosting, Build-Tools, etc)") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=kentcdodds "Tests") | [<img src="https://avatars.githubusercontent.com/u/5554486?v=3" width="100px;"/><br /><sub><b>Gyandeep Singh</b></sub>](http://gyandeeps.com)<br />[👀](#review-gyandeeps "Reviewed Pull Requests") | [<img src="https://avatars.githubusercontent.com/u/682584?v=3" width="100px;"/><br /><sub><b>Igor Pnev</b></sub>](https://github.com/exdeniz)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3Aexdeniz "Bug reports") | [<img src="https://avatars.githubusercontent.com/u/813865?v=3" width="100px;"/><br /><sub><b>Benjamin Tan</b></sub>](https://demoneaux.github.io/)<br />[💬](#question-demoneaux "Answering Questions") [👀](#review-demoneaux "Reviewed Pull Requests") | [<img src="https://avatars.githubusercontent.com/u/622118?v=3" width="100px;"/><br /><sub><b>Eric McCormick</b></sub>](https://ericmccormick.io)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=edm00se "Code") [📖](https://github.com/prettier/prettier-eslint/commits?author=edm00se "Documentation") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=edm00se "Tests") | [<img src="https://avatars.githubusercontent.com/u/2142817?v=3" width="100px;"/><br /><sub><b>Simon Lydell</b></sub>](https://github.com/lydell)<br />[📖](https://github.com/prettier/prettier-eslint/commits?author=lydell "Documentation") | [<img src="https://avatars0.githubusercontent.com/u/981957?v=3" width="100px;"/><br /><sub><b>Tom McKearney</b></sub>](https://github.com/tommck)<br />[📖](https://github.com/prettier/prettier-eslint/commits?author=tommck "Documentation") [💡](#example-tommck "Examples") |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| [<img src="https://avatars.githubusercontent.com/u/463105?v=3" width="100px;"/><br /><sub><b>Patrik Åkerstrand</b></sub>](https://github.com/PAkerstrand)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=PAkerstrand "Code") | [<img src="https://avatars.githubusercontent.com/u/1560301?v=3" width="100px;"/><br /><sub><b>Lochlan Bunn</b></sub>](https://twitter.com/loklaan)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=loklaan "Code") | [<img src="https://avatars.githubusercontent.com/u/25886902?v=3" width="100px;"/><br /><sub><b>Daniël Terwiel</b></sub>](https://github.com/danielterwiel)<br />[🔌](#plugin-danielterwiel "Plugin/utility libraries") [🔧](#tool-danielterwiel "Tools") | [<img src="https://avatars1.githubusercontent.com/u/1834413?v=3" width="100px;"/><br /><sub><b>Robin Malfait</b></sub>](https://robinmalfait.com)<br />[🔧](#tool-RobinMalfait "Tools") | [<img src="https://avatars0.githubusercontent.com/u/8161781?v=3" width="100px;"/><br /><sub><b>Michael McDermott</b></sub>](http://mgmcdermott.com)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=mgmcdermott "Code") | [<img src="https://avatars3.githubusercontent.com/u/292365?v=3" width="100px;"/><br /><sub><b>Adam Stankiewicz</b></sub>](http://sheerun.net)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=sheerun "Code") | [<img src="https://avatars3.githubusercontent.com/u/487068?v=3" width="100px;"/><br /><sub><b>Stephen John Sorensen</b></sub>](http://www.stephenjohnsorensen.com/)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=spudly "Code") |
| [<img src="https://avatars2.githubusercontent.com/u/1597820?v=3" width="100px;"/><br /><sub><b>Brian Di Palma</b></sub>](https://github.com/briandipalma)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3Abriandipalma "Bug reports") [💻](https://github.com/prettier/prettier-eslint/commits?author=briandipalma "Code") | [<img src="https://avatars0.githubusercontent.com/u/6173488?v=3" width="100px;"/><br /><sub><b>Rob Wise</b></sub>](https://robwise.github.io)<br />[📖](https://github.com/prettier/prettier-eslint/commits?author=robwise "Documentation") [💻](https://github.com/prettier/prettier-eslint/commits?author=robwise "Code") | [<img src="https://avatars0.githubusercontent.com/u/4818642?v=3" width="100px;"/><br /><sub><b>Patryk Peas</b></sub>](https://github.com/Belir)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3ABelir "Bug reports") [💻](https://github.com/prettier/prettier-eslint/commits?author=Belir "Code") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=Belir "Tests") | [<img src="https://avatars2.githubusercontent.com/u/1193520?v=3" width="100px;"/><br /><sub><b>Thijs Koerselman</b></sub>](http://vauxlab.com)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3A0x80 "Bug reports") [💻](https://github.com/prettier/prettier-eslint/commits?author=0x80 "Code") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=0x80 "Tests") | [<img src="https://avatars3.githubusercontent.com/u/7918284?v=3" width="100px;"/><br /><sub><b>Enrique Caballero</b></sub>](https://github.com/enriquecaballero)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3Aenriquecaballero "Bug reports") [💻](https://github.com/prettier/prettier-eslint/commits?author=enriquecaballero "Code") | [<img src="https://avatars2.githubusercontent.com/u/1408542?v=3" width="100px;"/><br /><sub><b>Łukasz Moroz</b></sub>](https://github.com/lukaszmoroz)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3Alukaszmoroz "Bug reports") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=lukaszmoroz "Tests") | [<img src="https://avatars0.githubusercontent.com/u/1215414?v=3" width="100px;"/><br /><sub><b>Simon Fridlund</b></sub>](https://github.com/zimme)<br />[💬](#question-zimme "Answering Questions") [🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3Azimme "Bug reports") [💻](https://github.com/prettier/prettier-eslint/commits?author=zimme "Code") [📖](https://github.com/prettier/prettier-eslint/commits?author=zimme "Documentation") [💡](#example-zimme "Examples") [🤔](#ideas-zimme "Ideas, Planning, & Feedback") [🚇](#infra-zimme "Infrastructure (Hosting, Build-Tools, etc)") [🔌](#plugin-zimme "Plugin/utility libraries") [👀](#review-zimme "Reviewed Pull Requests") [📢](#talk-zimme "Talks") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=zimme "Tests") [🔧](#tool-zimme "Tools") [✅](#tutorial-zimme "Tutorials") |
| [<img src="https://avatars1.githubusercontent.com/u/921609?v=3" width="100px;"/><br /><sub><b>Oliver Joseph Ash</b></sub>](https://oliverjash.me/)<br />[🐛](https://github.com/prettier/prettier-eslint/issues?q=author%3AOliverJAsh "Bug reports") [💻](https://github.com/prettier/prettier-eslint/commits?author=OliverJAsh "Code") | [<img src="https://avatars1.githubusercontent.com/u/3812133?v=3" width="100px;"/><br /><sub><b>Mark Palfreeman</b></sub>](http://palf.co)<br />[📖](https://github.com/prettier/prettier-eslint/commits?author=markpalfreeman "Documentation") | [<img src="https://avatars1.githubusercontent.com/u/3639670?v=4" width="100px;"/><br /><sub><b>Alex Taylor</b></sub>](https://github.com/alexmckenley)<br />[💻](https://github.com/prettier/prettier-eslint/commits?author=alexmckenley "Code") [⚠️](https://github.com/prettier/prettier-eslint/commits?author=alexmckenley "Tests") |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification.
Contributions of any kind welcome!

## LICENSE

MIT

[prettier]: https://github.com/jlongster/prettier
[eslint]: http://eslint.org/
[fix]: http://eslint.org/docs/user-guide/command-line-interface#fix
[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/prettier/prettier-eslint.svg?style=flat-square
[build]: https://travis-ci.org/prettier/prettier-eslint
[coverage-badge]: https://img.shields.io/codecov/c/github/prettier/prettier-eslint.svg?style=flat-square
[coverage]: https://codecov.io/github/prettier/prettier-eslint
[dependencyci-badge]: https://dependencyci.com/github/prettier/prettier-eslint/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/prettier/prettier-eslint
[version-badge]: https://img.shields.io/npm/v/prettier-eslint.svg?style=flat-square
[package]: https://www.npmjs.com/package/prettier-eslint
[downloads-badge]: https://img.shields.io/npm/dm/prettier-eslint.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=prettier-eslint&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/prettier-eslint.svg?style=flat-square
[license]: https://github.com/prettier/prettier-eslint/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: https://www.paypal.me/zimme
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/prettier/prettier-eslint/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/prettier/prettier-eslint/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/prettier/prettier-eslint/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/prettier/prettier-eslint.svg?style=social
[github-watch]: https://github.com/prettier/prettier-eslint/watchers
[github-star-badge]: https://img.shields.io/github/stars/prettier/prettier-eslint.svg?style=social
[github-star]: https://github.com/prettier/prettier-eslint/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20prettier-eslint!%20https://github.com/prettier/prettier-eslint%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/prettier/prettier-eslint.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[atom-plugin]: https://github.com/prettier/prettier-atom
[atom-dev-tools]: https://discuss.atom.io/t/how-to-make-developer-tools-appear/16232
[vscode-plugin]: https://github.com/esbenp/prettier-vscode
