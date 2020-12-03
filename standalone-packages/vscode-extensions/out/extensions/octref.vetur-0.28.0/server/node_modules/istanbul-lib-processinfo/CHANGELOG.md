# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [2.0.2](https://github.com/istanbuljs/istanbul-lib-processinfo/compare/v2.0.1...v2.0.2) (2019-10-08)

### [2.0.1](https://github.com/istanbuljs/istanbul-lib-processinfo/compare/v2.0.0...v2.0.1) (2019-10-07)


### ⚠ BREAKING CHANGES

* ProcessInfo#save is now async
* ProcessInfo#getCoverageMap is now async
* ProcessDB#writeIndex is now async
* ProcessDB#readIndex is now async
* ProcessDB#readProcessInfos is now async
* ProcessDB#renderTree is now async
* ProcessDB#buildProcessTree is now async
* ProcessDB#getCoverageMap is now async
* ProcessDB#spawn now returns a Promise which resolves to
the child process object
* ProcessDB#spawnSync has been removed
* ProcessDB#expunge is now async

### Bug Fixes

* Update dependencies ([e52e64e](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/e52e64e))


### Features

* Use async where possible ([#14](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/14)) ([67378ab](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/67378ab))

## [2.0.0](https://github.com/istanbuljs/istanbul-lib-processinfo/compare/v1.0.0...v2.0.0) (2019-06-20)


### Bug Fixes

* Do not crash when nyc is run inside itself. ([#3](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/3)) ([1774277](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/1774277)), closes [istanbuljs/nyc#1068](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/1068)
* Eagerly resolve processInfoDirectory ([#8](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/8)) ([c2a5fa8](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/c2a5fa8))
* Just use externalId from argument. ([#7](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/7)) ([d25b1ed](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/d25b1ed))
* Name field/property `directory` ([#11](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/11)) ([b70207e](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/b70207e))
* Remove `root` from processinfo ([#9](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/9)) ([2c2086a](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/2c2086a))
* Switch from mkdirp to make-dir, add to dependencies ([#5](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/5)) ([63b5e19](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/63b5e19))


### Features

* Require Node.js 8, update dependencies ([#10](https://github.com/istanbuljs/istanbul-lib-processinfo/issues/10)) ([36f03c0](https://github.com/istanbuljs/istanbul-lib-processinfo/commit/36f03c0))


### BREAKING CHANGES

* ProcessInfo field and property `processInfoDirectory` is
renamed to `directory`.
* ProcessDB readonly property `dir` is renamed to
`directory`.
* ProcessInfo directory must be set if `.save()` will be
used.  It is no longer calculated from NYC_CONFIG environment.
* Require Node.js 8, update dependencies (#10)
* The `root` field has been removed from processinfo files.
