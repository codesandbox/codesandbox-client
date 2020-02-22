# didyoumean2

[![Build Status](https://img.shields.io/circleci/project/foray1010/didyoumean2/master.svg)](https://circleci.com/gh/foray1010/didyoumean2/tree/master)
[![codecov.io](https://img.shields.io/codecov/c/github/foray1010/didyoumean2.svg)](https://codecov.io/github/foray1010/didyoumean2?branch=master)

[![node](https://img.shields.io/node/v/didyoumean2.svg)](https://www.npmjs.com/package/didyoumean2)
[![npm](https://img.shields.io/npm/dm/didyoumean2.svg)](https://www.npmjs.com/package/didyoumean2)
[![npm](https://img.shields.io/npm/l/didyoumean2.svg)](https://www.npmjs.com/package/didyoumean2)

`didyoumean2` is a library for matching human-quality input to a list of potential matches using the [Levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance).
It is inspired by [didyoumean.js](https://github.com/dcporter/didyoumean.js).

## Why reinventing the wheel

1. Based on [leven](https://github.com/sindresorhus/leven), the fastest JS implementation of the [Levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance)

1. ~100% faster than [didyoumean.js](https://github.com/dcporter/didyoumean.js)

1. Well tested with 100% coverage

1. Static type checking with [TypeScript](https://github.com/Microsoft/TypeScript)

1. More control on what kind of matches you want to return

1. Support matching object's `path` instead of just `key`

## Installation

```sh
npm install didyoumean2
```

```js
const didYouMean = require('didyoumean2').default
// or if you are using TypeScript or ES module
import didYouMean from 'didyoumean2'

// you can also access to Enums via:
const {
  default: didYouMean,
  ReturnTypeEnums,
  ThresholdTypeEnums
} = require('didyoumean2')
// or
import didYouMean, {ReturnTypeEnums, ThresholdTypeEnums} from 'didyoumean2'
```

## Usage

```js
didYouMean(input, matchList[, options])
```

- `input {string}`: A string that you are not sure and want to match with `matchList`

- `matchList {Object[]|string[]}`: A List for matching with `input`

- `options {Object}`(optional): An options that allows you to modify the behavior

- `@return {Array|null|Object|string}`: A list of or single matched result(s), return object if `match` is `{Object[]}`

### Options

#### `caseSensitive {boolean}`

- default: `false`

- Perform case-sensitive matching

#### `deburr {boolean}`

- default: `false`

- Perform [combining diacritical marks](https://en.wikipedia.org/wiki/Combining_Diacritical_Marks) insensitive matching

- Refer to [lodash _.deburr](https://lodash.com/docs#deburr) for how it works

#### `matchPath {Array}`

- default: `[]`

- If your `matchList` is an array of object, you must use `matchPath` to point to the string that you want to match

- Refer to [ramda R.path](http://ramdajs.com/docs/#path) for how to define the path, e.g. `['obj', 'array', 0, 'key']`

#### `returnType {string}`

- default: `ReturnTypeEnums.FIRST_CLOSEST_MATCH`

| returnType                            | Description                                                       |
|---------------------------------------|-------------------------------------------------------------------|
| `ReturnTypeEnums.ALL_CLOSEST_MATCHES` | Return all matches with the closest value to the `input` in array |
| `ReturnTypeEnums.ALL_MATCHES`         | Return all matches in array                                       |
| `ReturnTypeEnums.ALL_SORTED_MATCHES`  | Return all matches in array, sorted from closest to furthest      |
| `ReturnTypeEnums.FIRST_CLOSEST_MATCH` | Return first match from `ReturnTypeEnums.ALL_CLOSEST_MATCHES`     |
| `ReturnTypeEnums.FIRST_MATCH`         | Return first match (__FASTEST__)                                  |

#### `threshold {integer|number}`

- depends on `thresholdType`

- type: `{number}` (`similarity`) or `{integer}` (`edit-distance`)

- default: `0.4` (`similarity`) or `20` (`edit-distance`)

- If the result is larger (`similarity`) or smaller (`edit-distance`) than or equal to the `threshold`, that result is matched

#### `thresholdType {string}`

- default: `ThresholdTypeEnums.SIMILARITY`

| thresholdType                      | Description                                                                                                                                      |
|------------------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------|
| `ThresholdTypeEnums.EDIT_DISTANCE` | Refer to [Levenshtein distance algorithm](https://en.wikipedia.org/wiki/Levenshtein_distance), must be `integer`, lower value means more similar |
| `ThresholdTypeEnums.SIMILARITY`    | `l = max(input.length, matchItem.length), similarity = (l - editDistance) / l`, `number` from `0` to `1`, higher value means more similar        |

#### `trimSpaces {boolean}`

- default: `true`

- Remove noises when matching

- Trim all starting and ending spaces, and concatenate all continuous spaces to one space

## Test

___Before all:___

```sh
npm install -g yarn
yarn install
```

Unit test and coverage:

```sh
yarn test
```

Linter:

```sh
yarn lint
```
