# loglevel-colored-level-prefix

loglevel plugin that adds colored level prefix (node only)

[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Dependencies][dependencyci-badge]][dependencyci]
[![version][version-badge]][package]
[![downloads][downloads-badge]][npm-stat]
[![MIT License][license-badge]][LICENSE]

[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors)
[![PRs Welcome][prs-badge]][prs]
[![Donate][donate-badge]][donate]
[![Code of Conduct][coc-badge]][coc]
[![Roadmap][roadmap-badge]][roadmap]
[![Examples][examples-badge]][examples]

[![Watch on GitHub][github-watch-badge]][github-watch]
[![Star on GitHub][github-star-badge]][github-star]
[![Tweet][twitter-badge]][twitter]

## The problem

[`loglevel`][loglevel] is great, and I find that I often want the log output to
be formatted the same way every time. Also I don't really like some of the
implementation of `loglevel` (specifically the fact that it uses some browser
APIs for some things.

## This solution

This exposes a function to get a logger (singleton) with colored prefixes for
the level. Note that this only works in Node because it uses [`chalk`][chalk].

## Installation

This module is distributed via [npm][npm] which is bundled with [node][node] and should
be installed as one of your project's `dependencies`:

```
npm install --save loglevel-colored-level-prefix
```

## Usage

```javascript
const getLogger = require('loglevel-colored-level-prefix')
const options = {prefix: 'your-prefix', level: 'trace'}
const logger = getLogger(options)
logger.trace('WOW! What the stack trace!?')
// Trace: your-prefix [TRACE]: WOW! What the stack trace!?
//     at Logger.trace (<full-path>/node_modules/loglevel-colored-level-prefix/dist/index.js:54:24)
//     at ... etc
logger.debug('sup debug?')
// your-prefix [DEBUG]: sup debug?
logger.info('Hey info')
// your-prefix [INFO]: Hey info
logger.warn('Hi warn')
// your-prefix [WARN]: Hi warn
logger.error('Hello error')
// your-prefix [ERROR]: Hello error
```

Let's look at what that actually looks like...

[![][screenshot]][screenshot]

### options

#### prefix

**?String** - Whatever you want your prefix to be. Normally this is the tool
that you're logging for. The `getLogger` function will return the same instance
of the logger based on the given prefix.

#### level

**?String** - What you want the initial level to be set to. This defaults to:
`process.env.LOG_LEVEL || 'warn'`. Possible options are (in order of verbosity):
`trace`, `debug`, `info`, `warn`, `error`.

### returns

An instance of a `loglevel` logger. Learn more about that API from the
[`loglevel` docs][loglevel].

## Inspiration

I wrote this because I wanted to use the plugin I created for
[`prettier-eslint`][prettier-eslint] in
[`prettier-eslint-cli`][prettier-eslint-cli]. And I'll probably use it in other
projects/tools as well.

## Other Solutions

I'm unaware of other plugins for `loglevel` that do what this one does. But
there are _many_ logging solutions out there...

## Contributors

Thanks goes to these people ([emoji key][emojis]):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
| [<img src="https://avatars.githubusercontent.com/u/1500684?v=3" width="100px;"/><br /><sub>Kent C. Dodds</sub>](https://kentcdodds.com)<br />[💻](https://github.com/kentcdodds/loglevel-colored-level-prefix/commits?author=kentcdodds) [📖](https://github.com/kentcdodds/loglevel-colored-level-prefix/commits?author=kentcdodds) 🚇 [⚠️](https://github.com/kentcdodds/loglevel-colored-level-prefix/commits?author=kentcdodds) |
| :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors][all-contributors] specification. Contributions of any kind welcome!

## LICENSE

MIT

[npm]: https://www.npmjs.com/
[node]: https://nodejs.org
[build-badge]: https://img.shields.io/travis/kentcdodds/loglevel-colored-level-prefix.svg?style=flat-square
[build]: https://travis-ci.org/kentcdodds/loglevel-colored-level-prefix
[coverage-badge]: https://img.shields.io/codecov/c/github/kentcdodds/loglevel-colored-level-prefix.svg?style=flat-square
[coverage]: https://codecov.io/github/kentcdodds/loglevel-colored-level-prefix
[dependencyci-badge]: https://dependencyci.com/github/kentcdodds/loglevel-colored-level-prefix/badge?style=flat-square
[dependencyci]: https://dependencyci.com/github/kentcdodds/loglevel-colored-level-prefix
[version-badge]: https://img.shields.io/npm/v/loglevel-colored-level-prefix.svg?style=flat-square
[package]: https://www.npmjs.com/package/loglevel-colored-level-prefix
[downloads-badge]: https://img.shields.io/npm/dm/loglevel-colored-level-prefix.svg?style=flat-square
[npm-stat]: http://npm-stat.com/charts.html?package=loglevel-colored-level-prefix&from=2016-04-01
[license-badge]: https://img.shields.io/npm/l/loglevel-colored-level-prefix.svg?style=flat-square
[license]: https://github.com/kentcdodds/loglevel-colored-level-prefix/blob/master/other/LICENSE
[prs-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs]: http://makeapullrequest.com
[donate-badge]: https://img.shields.io/badge/$-support-green.svg?style=flat-square
[donate]: http://kcd.im/donate
[coc-badge]: https://img.shields.io/badge/code%20of-conduct-ff69b4.svg?style=flat-square
[coc]: https://github.com/kentcdodds/loglevel-colored-level-prefix/blob/master/other/CODE_OF_CONDUCT.md
[roadmap-badge]: https://img.shields.io/badge/%F0%9F%93%94-roadmap-CD9523.svg?style=flat-square
[roadmap]: https://github.com/kentcdodds/loglevel-colored-level-prefix/blob/master/other/ROADMAP.md
[examples-badge]: https://img.shields.io/badge/%F0%9F%92%A1-examples-8C8E93.svg?style=flat-square
[examples]: https://github.com/kentcdodds/loglevel-colored-level-prefix/blob/master/other/EXAMPLES.md
[github-watch-badge]: https://img.shields.io/github/watchers/kentcdodds/loglevel-colored-level-prefix.svg?style=social
[github-watch]: https://github.com/kentcdodds/loglevel-colored-level-prefix/watchers
[github-star-badge]: https://img.shields.io/github/stars/kentcdodds/loglevel-colored-level-prefix.svg?style=social
[github-star]: https://github.com/kentcdodds/loglevel-colored-level-prefix/stargazers
[twitter]: https://twitter.com/intent/tweet?text=Check%20out%20loglevel-colored-level-prefix!%20https://github.com/kentcdodds/loglevel-colored-level-prefix%20%F0%9F%91%8D
[twitter-badge]: https://img.shields.io/twitter/url/https/github.com/kentcdodds/loglevel-colored-level-prefix.svg?style=social
[emojis]: https://github.com/kentcdodds/all-contributors#emoji-key
[all-contributors]: https://github.com/kentcdodds/all-contributors
[loglevel]: https://www.npmjs.com/package/loglevel
[prettier-eslint]: https://github.com/kentcdodds/prettier-eslint
[prettier-eslint-cli]: https://github.com/kentcdodds/prettier-eslint-cli
[chalk]: https://www.npmjs.com/package/chalk
[screenshot]: https://raw.githubusercontent.com/kentcdodds/loglevel-colored-level-prefix/master/other/screenshot.png
