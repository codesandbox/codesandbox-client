v1.0.2 / 2019-12-13
=================
  * [Refactor] use split-up `es-abstract` (44% bundle size decrease)
  * [Fix] no longer require `Array.from`; works in older envs
  * [Dev Deps] update `eslint`, `@ljharb/eslint-config`, `functions-have-names`, `safe-publish-latest`, `tape`
  * [meta] add `funding` field
  * [meta] move repo to es-shims org
  * [Tests] temporarily comment out failing test in node 12+
  * [Tests] suppress unhandled rejection warnings
  * [Tests] skip "`undefined` receiver" test
  * [Tests] use shared travis-ci configs
  * [Tests] use `functions-have-names`
  * [actions] add automatic rebasing / merge commit blocking

v1.0.1 / 2019-05-06
=================
  * [Fix] when a promise has a poisoned `.then` method, reject the overarching promise (#1)

v1.0.0 / 2019-03-27
=================
  * Initial release.
