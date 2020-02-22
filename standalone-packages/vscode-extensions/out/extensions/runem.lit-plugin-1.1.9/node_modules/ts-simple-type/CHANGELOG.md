# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="0.3.6"></a>

## [0.3.6](https://github.com/runem/ts-simple-type/compare/v0.3.5...v0.3.6) (2019-08-17)

### Features

-   Make it possible to overwrite type checking logic by running user defined code when comparing types ([5a5e376](https://github.com/runem/ts-simple-type/commit/5a5e376))

<a name="0.3.5"></a>

## [0.3.5](https://github.com/runem/ts-simple-type/compare/v0.3.4...v0.3.5) (2019-07-16)

### Bug Fixes

-   Check in rollup.config.js. This fixes [#6](https://github.com/runem/ts-simple-type/issues/6) ([5fcb5cc](https://github.com/runem/ts-simple-type/commit/5fcb5cc))
-   Fix multiple failing assignability checks when comparing tuples, intersections, never and object types ([b1b06c0](https://github.com/runem/ts-simple-type/commit/b1b06c0))
-   Fix some failing tests when comparing recursive types and object assignability with zero properties in common ([11ca879](https://github.com/runem/ts-simple-type/commit/11ca879))
-   Fix tuple and intersection checking ([95bdcdb](https://github.com/runem/ts-simple-type/commit/95bdcdb))
-   Fix typo 'SimpleTyoeCircularRef'. This closes [#7](https://github.com/runem/ts-simple-type/issues/7) ([5b73bf1](https://github.com/runem/ts-simple-type/commit/5b73bf1))

<a name="0.3.3"></a>

## [0.3.3](https://github.com/runem/ts-simple-type/compare/v0.3.2...v0.3.3) (2019-05-02)

<a name="0.3.2"></a>

## [0.3.2](https://github.com/runem/ts-simple-type/compare/v0.3.1...v0.3.2) (2019-04-26)

<a name="0.3.1"></a>

## [0.3.1](https://github.com/runem/ts-simple-type/compare/v0.2.28...v0.3.1) (2019-04-25)

### Bug Fixes

-   Fix generic type recursion ([e65b106](https://github.com/runem/ts-simple-type/commit/e65b106))

### Features

-   Add support for intersection types and never types ([f7d531b](https://github.com/runem/ts-simple-type/commit/f7d531b))

<a name="0.3.0"></a>

# [0.3.0](https://github.com/runem/ts-simple-type/compare/v0.2.28...v0.3.0) (2019-04-23)

### Features

-   Add support for intersection types and never types ([f7d531b](https://github.com/runem/ts-simple-type/commit/f7d531b))
-   Add support for strict null checks ([19fce94](https://github.com/runem/ts-simple-type/commit/19fce94e869ff1f125764f5d102cda617373d563))

<a name="0.2.28"></a>

## [0.2.28](https://github.com/runem/ts-simple-type/compare/v0.2.27...v0.2.28) (2019-04-08)

### Bug Fixes

-   ArrayLike and PromiseLike ([6d51122](https://github.com/runem/ts-simple-type/commit/6d51122))
-   Fix various function checks and add more function related test cases ([cd8c1c5](https://github.com/runem/ts-simple-type/commit/cd8c1c5))

<a name="0.2.27"></a>

## [0.2.27](https://github.com/runem/ts-simple-type/compare/v0.2.26...v0.2.27) (2019-03-07)

### Bug Fixes

-   Fix problem where isAssignableToSimpleTypeKind wouldn't match ANY ([7edd4b3](https://github.com/runem/ts-simple-type/commit/7edd4b3))

<a name="0.2.26"></a>

## [0.2.26](https://github.com/runem/ts-simple-type/compare/v0.2.24...v0.2.26) (2019-03-07)

### Features

-   isAssignableToSimpleTypeKind now treats kind OBJECT without members as kind ANY ([b75ff9a](https://github.com/runem/ts-simple-type/commit/b75ff9a))

<a name="0.2.25"></a>

## [0.2.25](https://github.com/runem/ts-simple-type/compare/v0.2.24...v0.2.25) (2019-02-25)

<a name="0.2.24"></a>

## [0.2.24](https://github.com/runem/ts-simple-type/compare/v0.2.23...v0.2.24) (2019-02-25)

### Bug Fixes

-   Allow assigning anything but 'null' and 'undefined' to the type '{}' ([5f0b097](https://github.com/runem/ts-simple-type/commit/5f0b097))

<a name="0.2.23"></a>

## [0.2.23](https://github.com/runem/ts-simple-type/compare/v0.2.22...v0.2.23) (2019-02-15)

### Bug Fixes

-   Issue where isAssignableToSimpleTypeKind would fail with type 'ANY' ([38d7743](https://github.com/runem/ts-simple-type/commit/38d7743))

<a name="0.2.22"></a>

## [0.2.22](https://github.com/runem/ts-simple-type/compare/v0.2.21...v0.2.22) (2019-02-15)

<a name="0.2.21"></a>

## [0.2.21](https://github.com/runem/ts-simple-type/compare/v0.2.20...v0.2.21) (2019-02-15)

### Features

-   Add function that can return the string representation of either a native typescript type or a simple type ([2019248](https://github.com/runem/ts-simple-type/commit/2019248))

<a name="0.2.20"></a>

## [0.2.20](https://github.com/runem/ts-simple-type/compare/v0.2.19...v0.2.20) (2019-02-12)

### Bug Fixes

-   Fix problem where recursive types created from the cache would crash the type checking ([b62167a](https://github.com/runem/ts-simple-type/commit/b62167a))

<a name="0.2.19"></a>

## [0.2.19](https://github.com/runem/ts-simple-type/compare/v0.2.18...v0.2.19) (2019-02-11)

### Features

-   Add 'Date' type for performance gains. ([a8c74de](https://github.com/runem/ts-simple-type/commit/a8c74de))

<a name="0.2.18"></a>

## [0.2.18](https://github.com/runem/ts-simple-type/compare/v0.2.17...v0.2.18) (2019-02-10)

### Features

-   Add ALIAS, GENERIC and PROMISE types. Refactor and improve type checking logic especially for very complex types. ([e1e636c](https://github.com/runem/ts-simple-type/commit/e1e636c))

<a name="0.2.17"></a>

## [0.2.17](https://github.com/runem/ts-simple-type/compare/v0.2.16...v0.2.17) (2019-01-15)

### Bug Fixes

-   Fix function that checks if input to functions is node or type ([3eafb07](https://github.com/runem/ts-simple-type/commit/3eafb07))

<a name="0.2.16"></a>

## 0.2.16 (2019-01-10)

### Features

-   Add support for circular referenced types ([90ba8f5](https://github.com/runem/ts-simple-type/commit/90ba8f5))

<a name="0.2.15"></a>

## 0.2.15 (2019-01-10)

### Features

-   Add support for circular referenced types ([90ba8f5](https://github.com/runem/ts-simple-type/commit/90ba8f5))
