# @endemolshinegroup/cosmiconfig-typescript-loader

[![MIT Licensed][icon-license]][link-license]
[![NPM Version][icon-npm]][link-npm]
[![Build Status][icon-ci]][link-ci]
[![Greenkeeper Status][icon-greenkeeper]][link-greenkeeper]

[![Code Issues][icon-issues]][link-issues]
[![Codebase Maintainability][icon-maintainability]][link-maintainability]
[![Test Coverage][icon-coverage]][link-coverage]
[![Jest][icon-jest]][link-jest]

[![Commitizen][icon-commitizen]][link-commitizen]
[![Semantic Release][icon-semantic-release]][link-semantic-release]
[![Prettier][icon-prettier]][link-prettier]

A TypeScript loader for Cosmiconfig

## Installation

```bash
yarn add @endemolshinegroup/cosmiconfig-typescript-loader
```

## Usage

```typescript
import cosmiconfig from 'cosmiconfig';
import TypeScriptLoader from '@endemolshinegroup/cosmiconfig-typescript-loader';

const explorer = cosmiconfig('myModuleName', {
  loaders: {
    '.ts': {
      async: TypeScriptLoader,
    },
  },
});
```

[icon-license]: https://img.shields.io/github/license/EndemolShineGroup/cosmiconfig-typescript-loader.svg?longCache=true&style=flat-square
[link-license]: LICENSE
[icon-npm]: https://img.shields.io/npm/v/@endemolshinegroup/cosmiconfig-typescript-loader.svg?longCache=true&style=flat-square
[link-npm]: https://www.npmjs.com/package/@endemolshinegroup/cosmiconfig-typescript-loader
[icon-ci]: https://img.shields.io/travis/com/EndemolShineGroup/cosmiconfig-typescript-loader.svg?longCache=true&style=flat-square
[link-ci]: https://travis-ci.com/EndemolShineGroup/cosmiconfig-typescript-loader
[icon-greenkeeper]: https://img.shields.io/badge/greenkeeper-enabled-brightgreen.svg?longCache=true&style=flat-square
[link-greenkeeper]: https://greenkeeper.io/

[icon-issues]: https://img.shields.io/codeclimate/issues/EndemolShineGroup/cosmiconfig-typescript-loader.svg?longCache=true&style=flat-square
[link-issues]: https://codeclimate.com/github/EndemolShineGroup/cosmiconfig-typescript-loader/issues
[icon-maintainability]: https://img.shields.io/codeclimate/maintainability/EndemolShineGroup/cosmiconfig-typescript-loader.svg?longCache=true&style=flat-square
[link-maintainability]: https://codeclimate.com/github/EndemolShineGroup/cosmiconfig-typescript-loader
[icon-coverage]: https://img.shields.io/codecov/c/github/EndemolShineGroup/cosmiconfig-typescript-loader/develop.svg?longCache=true&style=flat-square
[link-coverage]: https://codecov.io/gh/EndemolShineGroup/cosmiconfig-typescript-loader

[icon-jest]: https://img.shields.io/badge/tested_with-jest-99424f.svg?longCache=true&style=flat-square
[link-jest]: https://jestjs.io/

[icon-commitizen]: https://img.shields.io/badge/commitizen-friendly-brightgreen.svg?longCache=true&style=flat-square
[link-commitizen]: http://commitizen.github.io/cz-cli/
[icon-semantic-release]: https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?longCache=true&style=flat-square
[link-semantic-release]: https://semantic-release.gitbooks.io/semantic-release/
[icon-prettier]: https://img.shields.io/badge/code_style-prettier-ff69b4.svg?longCache=true&style=flat-square
[link-prettier]: https://prettier.io/

