<a name="0.7.6"></a>
## [0.7.6](https://github.com/angular/zone.js/compare/v0.7.4...0.7.6) (2017-01-17)


### Bug Fixes

* **doc:** typo in comment and reformat README.md ([#590](https://github.com/angular/zone.js/issues/590)) ([95ad315](https://github.com/angular/zone.js/commit/95ad315))
* **ZoneAwareError:** Error should keep prototype chain and can be called without new ([82722c3](https://github.com/angular/zone.js/commit/82722c3)), closes [#546](https://github.com/angular/zone.js/issues/546) [#554](https://github.com/angular/zone.js/issues/554) [#555](https://github.com/angular/zone.js/issues/555)
* [#536](https://github.com/angular/zone.js/issues/536), add notification api patch ([#599](https://github.com/angular/zone.js/issues/599)) ([83dfa97](https://github.com/angular/zone.js/commit/83dfa97))
* [#593](https://github.com/angular/zone.js/issues/593), only call removeAttribute when have the method ([#594](https://github.com/angular/zone.js/issues/594)) ([1401d60](https://github.com/angular/zone.js/commit/1401d60))
* [#595](https://github.com/angular/zone.js/issues/595), refactor ZoneAwareError property copy ([#597](https://github.com/angular/zone.js/issues/597)) ([f7330de](https://github.com/angular/zone.js/commit/f7330de))
* [#604](https://github.com/angular/zone.js/issues/604), sometimes setInterval test spec will fail on Android 4.4 ([#605](https://github.com/angular/zone.js/issues/605)) ([e3cd1f4](https://github.com/angular/zone.js/commit/e3cd1f4))
* add missing test MutationObserver ([5c7bc01](https://github.com/angular/zone.js/commit/5c7bc01))
* Promise.toString() to look like native function ([f854ce0](https://github.com/angular/zone.js/commit/f854ce0))



<a name="0.7.5"></a>
## [0.7.5](https://github.com/angular/zone.js/compare/v0.7.4...0.7.5) (2017-01-12)


### Bug Fixes

* patch fs methods as macrotask, add test cases of fs watcher ([#572](https://github.com/angular/zone.js/issues/572)) ([e1d3240](https://github.com/angular/zone.js/commit/e1d3240))
* fix [#577](https://github.com/angular/zone.js/issues/577), canPatchViaPropertyDescriptor test should add configurable to XMLHttpRequest.prototype ([#578](https://github.com/angular/zone.js/issues/578)) ([c297752](https://github.com/angular/zone.js/commit/c297752))
* fix [#551](https://github.com/angular/zone.js/issues/551), add toJSON to ZoneTask to prevent cyclic error ([#576](https://github.com/angular/zone.js/issues/576)) ([03d19f9](https://github.com/angular/zone.js/commit/03d19f9))
* fix [#574](https://github.com/angular/zone.js/issues/574), captureStackTrace will have additional stackframe from Zone will break binding.js ([#575](https://github.com/angular/zone.js/issues/575)) ([41f5306](https://github.com/angular/zone.js/commit/41f5306))
* fix [#569](https://github.com/angular/zone.js/issues/569), request will cause updateTaskCount failed if we call abort multipletimes ([#570](https://github.com/angular/zone.js/issues/570)) ([62f1449](https://github.com/angular/zone.js/commit/62f1449))
* add web-api.ts to patch mediaQuery ([#571](https://github.com/angular/zone.js/issues/571)) ([e92f934](https://github.com/angular/zone.js/commit/e92f934))
* fix [#584](https://github.com/angular/zone.js/issues/584), remove android 4.1~4.3, add no-ssl options to make android 4.4 pass test ([#586](https://github.com/angular/zone.js/issues/586)) ([7cd570e](https://github.com/angular/zone.js/commit/7cd570e))
* Fix [#532](https://github.com/angular/zone.js/issues/532), Fix [#566](https://github.com/angular/zone.js/issues/566), add tslint in ci, add tslint/format/test/karma in precommit of git ([#565](https://github.com/angular/zone.js/issues/565)) ([fb8d51c](https://github.com/angular/zone.js/commit/fb8d51c))
* docs(zone.ts): fix  typo ([#583](https://github.com/angular/zone.js/issues/583)) ([ecbef87](https://github.com/angular/zone.js/commit/ecbef87))
* add missing test MutationObserver ([5c7bc01](https://github.com/angular/zone.js/commit/5c7bc01))
* Promise.toString() to look like native function ([f854ce0](https://github.com/angular/zone.js/commit/f854ce0))
* **ZoneAwareError:** Error should keep prototype chain and can be called without new ([82722c3](https://github.com/angular/zone.js/commit/82722c3)), closes [#546](https://github.com/angular/zone.js/issues/546) [#554](https://github.com/angular/zone.js/issues/554) [#555](https://github.com/angular/zone.js/issues/555)



<a name="0.7.4"></a>
## [0.7.4](https://github.com/angular/zone.js/compare/v0.7.1...0.7.4) (2016-12-31)


### Bug Fixes

* add better Type safety ([610649b](https://github.com/angular/zone.js/commit/610649b))
* add missing test MutationObserver ([5c7bc01](https://github.com/angular/zone.js/commit/5c7bc01))
* correct currentZone passed into delegate methods ([dc12d8e](https://github.com/angular/zone.js/commit/dc12d8e)), closes [#587](https://github.com/angular/zone.js/issues/587) [#539](https://github.com/angular/zone.js/issues/539)
* correct zone.min.js not including zone ([384f5ec](https://github.com/angular/zone.js/commit/384f5ec))
* Correct ZoneAwareError prototype chain ([ba7858c](https://github.com/angular/zone.js/commit/ba7858c)), closes [#546](https://github.com/angular/zone.js/issues/546) [#547](https://github.com/angular/zone.js/issues/547)
* formatting issue. ([c70e9ec](https://github.com/angular/zone.js/commit/c70e9ec))
* inline event handler issue  ([20b5a5d](https://github.com/angular/zone.js/commit/20b5a5d)), closes [#525](https://github.com/angular/zone.js/issues/525) [#540](https://github.com/angular/zone.js/issues/540)
* parameterize `wrap` method on `Zone` ([#542](https://github.com/angular/zone.js/issues/542)) ([f522e1b](https://github.com/angular/zone.js/commit/f522e1b))
* **closure:** avoid property renaming on globals ([af14646](https://github.com/angular/zone.js/commit/af14646))
* Prevent adding  listener for xhrhttprequest multiple times ([9509747](https://github.com/angular/zone.js/commit/9509747)), closes [#529](https://github.com/angular/zone.js/issues/529) [#527](https://github.com/angular/zone.js/issues/527) [#287](https://github.com/angular/zone.js/issues/287) [#530](https://github.com/angular/zone.js/issues/530)
* Promise.toString() to look like native function ([f854ce0](https://github.com/angular/zone.js/commit/f854ce0))
* **closure:** Fix closure error suppression comment. ([#552](https://github.com/angular/zone.js/issues/552)) ([2643783](https://github.com/angular/zone.js/commit/2643783))
* Run tests on both the build as well as the dist folder ([#514](https://github.com/angular/zone.js/issues/514)) ([c0604f5](https://github.com/angular/zone.js/commit/c0604f5))
* support  nw.js environment ([486010b](https://github.com/angular/zone.js/commit/486010b)), closes [#524](https://github.com/angular/zone.js/issues/524)


### Features

* Patch captureStackTrace/prepareStackTrace to ZoneAwareError, patch process.nextTick, fix removeAllListeners bug ([#516](https://github.com/angular/zone.js/issues/516)) ([c36c0bc](https://github.com/angular/zone.js/commit/c36c0bc)), closes [#484](https://github.com/angular/zone.js/issues/484) [#491](https://github.com/angular/zone.js/issues/491)



<a name="0.7.1"></a>
## [0.7.1](https://github.com/angular/zone.js/compare/v0.7.0...v0.7.1) (2016-11-22)


### Bug Fixes

* missing zone from the build file ([e961833](https://github.com/angular/zone.js/commit/e961833))



<a name="0.7.0"></a>
# [0.7.0](https://github.com/angular/zone.js/compare/0.6.25...v0.7.0) (2016-11-22)


### Bug Fixes

* **node:** crash when calling listeners() for event with no listeners ([431f6f0](https://github.com/angular/zone.js/commit/431f6f0))
* support clearing the timeouts with numeric IDs ([fea6d68](https://github.com/angular/zone.js/commit/fea6d68)), closes [#461](https://github.com/angular/zone.js/issues/461)
* **promise:** include stack trace in an unhandlerd promise ([#463](https://github.com/angular/zone.js/issues/463)) ([737f8d8](https://github.com/angular/zone.js/commit/737f8d8))
* **property-descriptor:** do not use document object in Safari web worker ([51f2e1f](https://github.com/angular/zone.js/commit/51f2e1f))
* Add WebSocket to the NO_EVENT_TARGET list to be patched as well ([#493](https://github.com/angular/zone.js/issues/493)) ([d8c15eb](https://github.com/angular/zone.js/commit/d8c15eb))
* fix wrong usage of == caught by closure compiler ([#510](https://github.com/angular/zone.js/issues/510)) ([d7d8eb5](https://github.com/angular/zone.js/commit/d7d8eb5))
* fluent interface for EventEmitter ([#475](https://github.com/angular/zone.js/issues/475)) ([c5130a6](https://github.com/angular/zone.js/commit/c5130a6))
* lint errors ([ed87c26](https://github.com/angular/zone.js/commit/ed87c26))
* make fetch promise patching safe ([16be7f9](https://github.com/angular/zone.js/commit/16be7f9)), closes [#451](https://github.com/angular/zone.js/issues/451)
* Make the check for ZoneAwarePromise more stringent ([#495](https://github.com/angular/zone.js/issues/495)) ([c69df25](https://github.com/angular/zone.js/commit/c69df25))
* run all timers in passage of time in a single fakeAsync's tick call ([a85db4c](https://github.com/angular/zone.js/commit/a85db4c)), closes [#454](https://github.com/angular/zone.js/issues/454)
* stop using class extends as it breaks rollup ([b52cf02](https://github.com/angular/zone.js/commit/b52cf02))
* use strict equality in scheduleQueueDrain ([#504](https://github.com/angular/zone.js/issues/504)) ([4b4249c](https://github.com/angular/zone.js/commit/4b4249c))


### Features

* add mocha support ([41a9047](https://github.com/angular/zone.js/commit/41a9047))
* **Error:** Rewrite Error stack frames to include zone ([e1c2a02](https://github.com/angular/zone.js/commit/e1c2a02))



<a name="0.6.25"></a>
## [0.6.25](https://github.com/angular/zone.js/compare/0.6.24...0.6.25) (2016-09-20)


### Bug Fixes

* **zonespecs:** revert unwrapping of zonespecs which actually require global ([#460](https://github.com/angular/zone.js/issues/460)) ([28a14f8](https://github.com/angular/zone.js/commit/28a14f8))



<a name="0.6.24"></a>
## [0.6.24](https://github.com/angular/zone.js/compare/v0.6.23...0.6.24) (2016-09-19)


### Bug Fixes

* **bundling:** switch to using umd bundles ([#457](https://github.com/angular/zone.js/issues/457)) ([8dd06e5](https://github.com/angular/zone.js/commit/8dd06e5)), closes [#456](https://github.com/angular/zone.js/issues/456)



<a name="0.6.23"></a>
## [0.6.23](https://github.com/angular/zone.js/compare/v0.6.22...v0.6.23) (2016-09-14)


### Bug Fixes

* **fetch:** correct chrome not able to load about://blank ([3844435](https://github.com/angular/zone.js/commit/3844435)), closes [#444](https://github.com/angular/zone.js/issues/444)



<a name="0.6.22"></a>
## [0.6.22](https://github.com/angular/zone.js/compare/v0.6.21...v0.6.22) (2016-09-14)


### Bug Fixes

* use fetch(about://blank) to prevent exception on MS Edge ([#442](https://github.com/angular/zone.js/issues/442)) ([8b81537](https://github.com/angular/zone.js/commit/8b81537)), closes [#436](https://github.com/angular/zone.js/issues/436) [#439](https://github.com/angular/zone.js/issues/439)


### Features

* **node:** patch most fs methods ([#438](https://github.com/angular/zone.js/issues/438)) ([4c8a155](https://github.com/angular/zone.js/commit/4c8a155))
* **node:** patch outgoing http requests to capture the zone ([#430](https://github.com/angular/zone.js/issues/430)) ([100b82b](https://github.com/angular/zone.js/commit/100b82b))



<a name="0.6.21"></a>
## [0.6.21](https://github.com/angular/zone.js/compare/v0.6.20...v0.6.21) (2016-09-11)


### Bug Fixes

* proper detection of global in WebWorker ([0a7a155](https://github.com/angular/zone.js/commit/0a7a155))



<a name="0.6.20"></a>
## [0.6.20](https://github.com/angular/zone.js/compare/v0.6.19...v0.6.20) (2016-09-10)



<a name="0.6.19"></a>
## [0.6.19](https://github.com/angular/zone.js/compare/v0.6.17...v0.6.19) (2016-09-10)


### Bug Fixes

* provide a more usefull error when configuring properties ([1fe4df0](https://github.com/angular/zone.js/commit/1fe4df0))
* **jasmine:** propagate all arguments of it/describe/etc... ([a85fd68](https://github.com/angular/zone.js/commit/a85fd68))
* **long-stack:** Safer writing of stack traces. ([6767ff5](https://github.com/angular/zone.js/commit/6767ff5))
* **promise:** support more aggressive optimization. ([#431](https://github.com/angular/zone.js/issues/431)) ([26fc3da](https://github.com/angular/zone.js/commit/26fc3da))
* **XHR:** Don't send sync XHR through ZONE ([6e2f13c](https://github.com/angular/zone.js/commit/6e2f13c)), closes [#377](https://github.com/angular/zone.js/issues/377)


### Features

* assert that right ZoneAwarePromise is available ([#420](https://github.com/angular/zone.js/issues/420)) ([4c35e5b](https://github.com/angular/zone.js/commit/4c35e5b))



<a name="0.6.17"></a>
## [0.6.17](https://github.com/angular/zone.js/compare/v0.6.15...v0.6.17) (2016-08-22)


### Bug Fixes

* **browser:** use XMLHttpRequest.DONE constant on target instead of the global interface ([#395](https://github.com/angular/zone.js/issues/395)) ([3b4c20b](https://github.com/angular/zone.js/commit/3b4c20b)), closes [#394](https://github.com/angular/zone.js/issues/394)
* **jasmine:** spelling error of 'describe' in jasmine patch prevented application of sync zone ([d38ccde](https://github.com/angular/zone.js/commit/d38ccde)), closes [#412](https://github.com/angular/zone.js/issues/412)
* **patchProperty:** return null as the default value ([#413](https://github.com/angular/zone.js/issues/413)) ([396942b](https://github.com/angular/zone.js/commit/396942b)), closes [#319](https://github.com/angular/zone.js/issues/319)
* IE10/11 timeout issues. ([382182c](https://github.com/angular/zone.js/commit/382182c))



<a name="0.6.15"></a>
## [0.6.15](https://github.com/angular/zone.js/compare/v0.6.14...v0.6.15) (2016-08-19)


### Bug Fixes

* broken build. ([#406](https://github.com/angular/zone.js/issues/406)) ([5e3c207](https://github.com/angular/zone.js/commit/5e3c207))
* **tasks:** do not drain the microtask queue early. ([ff88bb4](https://github.com/angular/zone.js/commit/ff88bb4))
* **tasks:** do not drain the microtask queue early. ([d4a1436](https://github.com/angular/zone.js/commit/d4a1436))



<a name="0.6.14"></a>
## [0.6.14](https://github.com/angular/zone.js/compare/v0.6.13...v0.6.14) (2016-08-17)


### Features

* **jasmine:** patch jasmine to understand zones. ([3a054be](https://github.com/angular/zone.js/commit/3a054be))
* **trackingZone:** Keep track of tasks to see outstanding tasks. ([4942b4a](https://github.com/angular/zone.js/commit/4942b4a))



<a name="0.6.13"></a>
## [0.6.13](https://github.com/angular/zone.js/compare/v0.6.12...v0.6.13) (2016-08-15)


### Bug Fixes

* **browser:** make Object.defineProperty patch safer ([#392](https://github.com/angular/zone.js/issues/392)) ([597c634](https://github.com/angular/zone.js/commit/597c634)), closes [#391](https://github.com/angular/zone.js/issues/391)
* **browser:** patch Window when EventTarget is missing. ([#368](https://github.com/angular/zone.js/issues/368)) ([fcef80d](https://github.com/angular/zone.js/commit/fcef80d)), closes [#367](https://github.com/angular/zone.js/issues/367)
* **browser:** patchTimer cancelAnimationFrame ([#353](https://github.com/angular/zone.js/issues/353)) ([bf77fbb](https://github.com/angular/zone.js/commit/bf77fbb)), closes [#326](https://github.com/angular/zone.js/issues/326) [Leaflet/Leaflet#4588](https://github.com/Leaflet/Leaflet/issues/4588)
* **browser:** should not throw with frozen prototypes ([#351](https://github.com/angular/zone.js/issues/351)) ([27ca2a9](https://github.com/angular/zone.js/commit/27ca2a9))
* **build:** fix broken master due to setTimeout not returning a number on node ([d43b4b8](https://github.com/angular/zone.js/commit/d43b4b8))
* **doc:** Fixed the home page example. ([#348](https://github.com/angular/zone.js/issues/348)) ([9a0aa4a](https://github.com/angular/zone.js/commit/9a0aa4a))
* throw if trying to load zone more then once. ([6df5f93](https://github.com/angular/zone.js/commit/6df5f93))
* **fakeAsync:** throw error on rejected promisees. ([fd1dfcc](https://github.com/angular/zone.js/commit/fd1dfcc))
* **promise:** allow Promise subclassing ([dafad98](https://github.com/angular/zone.js/commit/dafad98))
* **XHR.responseBlob:** don't access XHR.responseBlob on old android webkit ([#329](https://github.com/angular/zone.js/issues/329)) ([ed69756](https://github.com/angular/zone.js/commit/ed69756))


### Features

* return timeout Id in ZoneTask.toString (fixes [#341](https://github.com/angular/zone.js/issues/341)) ([80ae6a8](https://github.com/angular/zone.js/commit/80ae6a8)), closes [#375](https://github.com/angular/zone.js/issues/375)
* **jasmine:** Switch jasmine patch to use microtask and preserve zone. ([5f519de](https://github.com/angular/zone.js/commit/5f519de))
* **ProxySpec:** create a ProxySpec which can proxy to other ZoneSpecs. ([2d02e39](https://github.com/angular/zone.js/commit/2d02e39))
* **zone:** Add Zone.getZone api ([0621014](https://github.com/angular/zone.js/commit/0621014))



<a name="0.6.12"></a>
## [0.6.12](https://github.com/angular/zone.js/compare/v0.6.11...v0.6.12) (2016-04-19)


### Bug Fixes

* **property-descriptor:** do not fail for events without targets ([3a8deef](https://github.com/angular/zone.js/commit/3a8deef))


### Features

* Add a zone spec for fake async test zone. ([#330](https://github.com/angular/zone.js/issues/330)) ([34159b4](https://github.com/angular/zone.js/commit/34159b4))



<a name="0.6.11"></a>
## [0.6.11](https://github.com/angular/zone.js/compare/v0.6.9...v0.6.11) (2016-04-14)


### Bug Fixes

* Suppress closure compiler warnings about unknown 'process' variable. ([e125173](https://github.com/angular/zone.js/commit/e125173)), closes [#295](https://github.com/angular/zone.js/issues/295)
* **setTimeout:** fix for [#290](https://github.com/angular/zone.js/issues/290), allow clearTimeout to be called in setTimeout callback ([a6967ad](https://github.com/angular/zone.js/commit/a6967ad)), closes [#301](https://github.com/angular/zone.js/issues/301)
* **WebSocket patch:** fix WebSocket constants copy ([#299](https://github.com/angular/zone.js/issues/299)) ([5dc4339](https://github.com/angular/zone.js/commit/5dc4339))
* **xhr:** XHR macrotasks allow abort after XHR has completed ([#311](https://github.com/angular/zone.js/issues/311)) ([c70f011](https://github.com/angular/zone.js/commit/c70f011))
* **zone:** remove debugger statement ([#292](https://github.com/angular/zone.js/issues/292)) ([01cec16](https://github.com/angular/zone.js/commit/01cec16))
* window undefined in node environments ([f8d5dc7](https://github.com/angular/zone.js/commit/f8d5dc7)), closes [#305](https://github.com/angular/zone.js/issues/305)


### Features

* **zonespec:** add a spec for synchronous tests ([#294](https://github.com/angular/zone.js/issues/294)) ([55da3d8](https://github.com/angular/zone.js/commit/55da3d8))
* node/node ([29fc5d2](https://github.com/angular/zone.js/commit/29fc5d2))



<a name="0.6.9"></a>
## [0.6.9](https://github.com/angular/zone.js/compare/v0.6.5...v0.6.9) (2016-04-04)


### Bug Fixes

* Allow calling clearTimeout from within the setTimeout callback ([a8ea55d](https://github.com/angular/zone.js/commit/a8ea55d)), closes [#302](https://github.com/angular/zone.js/issues/302)
* Canceling already run task should not double decrement task counter ([faa3485](https://github.com/angular/zone.js/commit/faa3485)), closes [#290](https://github.com/angular/zone.js/issues/290)
* **xhr:** don't throw on an xhr which is aborted before sending ([8827e1e](https://github.com/angular/zone.js/commit/8827e1e))
* **zone:** remove debugger statement ([d7c116b](https://github.com/angular/zone.js/commit/d7c116b))


### Features

* **zonespec:** add a spec for synchronous tests ([0a6a434](https://github.com/angular/zone.js/commit/0a6a434))
* treat XHRs as macrotasks ([fd39f97](https://github.com/angular/zone.js/commit/fd39f97))



<a name="0.6.5"></a>
## [0.6.5](https://github.com/angular/zone.js/compare/v0.6.2...v0.6.5) (2016-03-21)


### Bug Fixes

* disable safari 7 ([4a4d4f6](https://github.com/angular/zone.js/commit/4a4d4f6))
* **browser/utils:** calling removeEventListener twice with the same args should not cause errors ([1787339](https://github.com/angular/zone.js/commit/1787339)), closes [#283](https://github.com/angular/zone.js/issues/283) [#284](https://github.com/angular/zone.js/issues/284)
* **patching:** call native cancel method ([5783663](https://github.com/angular/zone.js/commit/5783663)), closes [#278](https://github.com/angular/zone.js/issues/278) [#279](https://github.com/angular/zone.js/issues/279)
* **utils:** add the ability to prevent the default action of onEvent (onclick, onpaste,etc..) by returning false. ([99940c3](https://github.com/angular/zone.js/commit/99940c3)), closes [#236](https://github.com/angular/zone.js/issues/236)
* **WebSocket patch:** keep WebSocket constants ([f25b087](https://github.com/angular/zone.js/commit/f25b087)), closes [#267](https://github.com/angular/zone.js/issues/267)
* **zonespec:** Do not crash on error if last task had no data ([0dba019](https://github.com/angular/zone.js/commit/0dba019)), closes [#281](https://github.com/angular/zone.js/issues/281)


### Features

* **indexdb:** Added property patches and event target methods as well as tests for Indexed DB ([84a251f](https://github.com/angular/zone.js/commit/84a251f)), closes [#204](https://github.com/angular/zone.js/issues/204)
* **zonespec:** add a spec for asynchronous tests ([aeeb05c](https://github.com/angular/zone.js/commit/aeeb05c)), closes [#275](https://github.com/angular/zone.js/issues/275)



<a name="0.6.2"></a>
## [0.6.2](https://github.com/angular/zone.js/compare/v0.6.1...v0.6.2) (2016-03-03)



<a name="0.6.1"></a>
## [0.6.1](https://github.com/angular/zone.js/compare/v0.6.0...v0.6.1) (2016-02-29)



<a name="0.6.0"></a>
# [0.6.0](https://github.com/angular/zone.js/compare/v0.5.15...v0.6.0) (2016-02-29)


### Chores

* **everything:** Major Zone Rewrite/Reimplementation ([63d4552](https://github.com/angular/zone.js/commit/63d4552))


### BREAKING CHANGES

* everything: This is a brand new implementation which is not backwards compatible.



<a name="0.5.15"></a>
## [0.5.15](https://github.com/angular/zone.js/compare/v0.5.14...v0.5.15) (2016-02-17)


### Bug Fixes

* **WebWorker:** Patch WebSockets and XMLHttpRequest in WebWorker ([45a6bc1](https://github.com/angular/zone.js/commit/45a6bc1)), closes [#249](https://github.com/angular/zone.js/issues/249)
* **WebWorker:** Patch WebSockets and XMLHttpRequest in WebWorker ([9041a3a](https://github.com/angular/zone.js/commit/9041a3a)), closes [#249](https://github.com/angular/zone.js/issues/249)



<a name="0.5.14"></a>
## [0.5.14](https://github.com/angular/zone.js/compare/v0.5.11...v0.5.14) (2016-02-11)



<a name="0.5.11"></a>
## [0.5.11](https://github.com/angular/zone.js/compare/v0.5.10...v0.5.11) (2016-01-27)


### Bug Fixes

* correct incorrect example path in karma config ([b0a624d](https://github.com/angular/zone.js/commit/b0a624d))
* correct test relaying on jasmine timeout ([4f7d6ae](https://github.com/angular/zone.js/commit/4f7d6ae))
* **WebSocket:** don't patch EventTarget methods twice ([345e56c](https://github.com/angular/zone.js/commit/345e56c)), closes [#235](https://github.com/angular/zone.js/issues/235)


### Features

* **wtf:** add wtf support to (set/clear)Timeout/Interval/Immediate ([6659fd5](https://github.com/angular/zone.js/commit/6659fd5))



<a name="0.5.10"></a>
## [0.5.10](https://github.com/angular/zone.js/compare/v0.5.9...v0.5.10) (2015-12-11)


### Bug Fixes

* **keys:** Do not use Symbol which are broken in Chrome 39.0.2171 (Dartium) ([c48301b](https://github.com/angular/zone.js/commit/c48301b))
* **Promise:** Make sure we check for native Promise before es6-promise gets a chance to polyfill ([fa18d4c](https://github.com/angular/zone.js/commit/fa18d4c))



<a name="0.5.9"></a>
## [0.5.9](https://github.com/angular/zone.js/compare/v0.5.8...v0.5.9) (2015-12-09)


### Bug Fixes

* **keys:** do not declare functions inside blocks ([d44d699](https://github.com/angular/zone.js/commit/d44d699)), closes [#194](https://github.com/angular/zone.js/issues/194)
* **keys:** Symbol is being checked for type of function ([6714be6](https://github.com/angular/zone.js/commit/6714be6))
* **mutation-observe:** output of typeof operator should be string ([19703e3](https://github.com/angular/zone.js/commit/19703e3))
* **util:** origin addEventListener/removeEventListener should be called without eventListener ([26e7f51](https://github.com/angular/zone.js/commit/26e7f51)), closes [#198](https://github.com/angular/zone.js/issues/198)
* **utils:** should have no effect when called addEventListener/removeEventListener without eventListener. ([5bcc6ae](https://github.com/angular/zone.js/commit/5bcc6ae))



<a name="0.5.8"></a>
## [0.5.8](https://github.com/angular/zone.js/compare/v0.5.7...v0.5.8) (2015-10-06)


### Bug Fixes

* **addEventListener:** when called from the global scope ([a23d61a](https://github.com/angular/zone.js/commit/a23d61a)), closes [#190](https://github.com/angular/zone.js/issues/190)
* **EventTarget:** apply the patch even if `Window` is not defined ([32c6df9](https://github.com/angular/zone.js/commit/32c6df9))



<a name="0.5.7"></a>
## [0.5.7](https://github.com/angular/zone.js/compare/v0.5.6...v0.5.7) (2015-09-29)


### Bug Fixes

* **RequestAnimationFrame:** pass the timestamp to the callback ([79a37c0](https://github.com/angular/zone.js/commit/79a37c0)), closes [#187](https://github.com/angular/zone.js/issues/187)



<a name="0.5.6"></a>
## [0.5.6](https://github.com/angular/zone.js/compare/v0.5.5...v0.5.6) (2015-09-25)


### Bug Fixes

* **Jasmine:** add support for jasmine 2 done.fail() ([1d4370b](https://github.com/angular/zone.js/commit/1d4370b)), closes [#180](https://github.com/angular/zone.js/issues/180)
* **utils:** fixes event target patch in web workers ([ad5c0c8](https://github.com/angular/zone.js/commit/ad5c0c8))



<a name="0.5.5"></a>
## [0.5.5](https://github.com/angular/zone.js/compare/v0.5.4...v0.5.5) (2015-09-11)


### Bug Fixes

* **lib/utils:** adds compliant handling of useCapturing param for EventTarget methods ([dd2e1bf](https://github.com/angular/zone.js/commit/dd2e1bf))
* **lib/utils:** fixes incorrect behaviour when re-adding the same event listener fn ([1b804cf](https://github.com/angular/zone.js/commit/1b804cf))
* **longStackTraceZone:** modifies stackFramesFilter to exclude zone.js frames ([50ce9f3](https://github.com/angular/zone.js/commit/50ce9f3))


### Features

* **lib/core:** add/removeEventListener hooks ([1897440](https://github.com/angular/zone.js/commit/1897440))
* **lib/patch/file-reader:** zone-binds FileReader#onEventName listeners ([ce589b9](https://github.com/angular/zone.js/commit/ce589b9)), closes [#137](https://github.com/angular/zone.js/issues/137)



<a name="0.5.4"></a>
## [0.5.4](https://github.com/angular/zone.js/compare/v0.5.3...v0.5.4) (2015-08-31)


### Bug Fixes

* js path in examples ([c7a2ed9](https://github.com/angular/zone.js/commit/c7a2ed9))
* **zone:** fix conflict with Polymer elements ([77b4c0d](https://github.com/angular/zone.js/commit/77b4c0d))


### Features

* **patch:** support requestAnimationFrame time loops ([3d6dc08](https://github.com/angular/zone.js/commit/3d6dc08))



<a name="0.5.3"></a>
## [0.5.3](https://github.com/angular/zone.js/compare/v0.5.2...v0.5.3) (2015-08-21)


### Bug Fixes

* **addEventListener patch:** ignore FunctionWrapper for IE11 & Edge dev tools ([3b0ca3f](https://github.com/angular/zone.js/commit/3b0ca3f))
* **utils:** event listener patches break when passed an object implementing EventListener ([af88ff8](https://github.com/angular/zone.js/commit/af88ff8))
* **WebWorker:** Fix patching in WebWorker ([2cc59d8](https://github.com/angular/zone.js/commit/2cc59d8))


### Features

* **zone.js:** support Android browser ([93b5555](https://github.com/angular/zone.js/commit/93b5555))



<a name="0.5.2"></a>
## [0.5.2](https://github.com/angular/zone.js/compare/v0.5.1...v0.5.2) (2015-07-01)


### Bug Fixes

* **jasmine patch:** forward timeout ([2dde717](https://github.com/angular/zone.js/commit/2dde717))
* **zone.bind:** throw an error if arg is not a function ([ee4262a](https://github.com/angular/zone.js/commit/ee4262a))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/angular/zone.js/compare/v0.5.0...v0.5.1) (2015-06-10)


### Bug Fixes

* **PatchClass:** copy static properties ([b91f8fe](https://github.com/angular/zone.js/commit/b91f8fe)), closes [#127](https://github.com/angular/zone.js/issues/127)
* **register-element:** add check for callback being own property of opts ([8bce00e](https://github.com/angular/zone.js/commit/8bce00e)), closes [#52](https://github.com/angular/zone.js/issues/52)


### Features

* **fetch:** patch the fetch API ([4d3d524](https://github.com/angular/zone.js/commit/4d3d524)), closes [#108](https://github.com/angular/zone.js/issues/108)
* **geolocation:** patch the API ([cd13da1](https://github.com/angular/zone.js/commit/cd13da1)), closes [#113](https://github.com/angular/zone.js/issues/113)
* **jasmine:** export the jasmine patch ([639d5e7](https://github.com/angular/zone.js/commit/639d5e7))
* **test:** serve lib/ files instead of dist/ ([f835213](https://github.com/angular/zone.js/commit/f835213))
* **zone.js:** support IE9+ ([554fae0](https://github.com/angular/zone.js/commit/554fae0))



<a name="0.5.0"></a>
# [0.5.0](https://github.com/angular/zone.js/compare/v0.4.4...v0.5.0) (2015-05-08)


### Bug Fixes

* always run jasmine's done callbacks for async tests in jasmine's zone ([b7f3d04](https://github.com/angular/zone.js/commit/b7f3d04)), closes [#91](https://github.com/angular/zone.js/issues/91)
* don't fork new zones for callbacks from the root zone ([531d0ec](https://github.com/angular/zone.js/commit/531d0ec)), closes [#92](https://github.com/angular/zone.js/issues/92)
* **MutationObserver:** executes hooks in the creation zone ([3122a48](https://github.com/angular/zone.js/commit/3122a48))
* **test:** fix an ineffective assertion ([d85d2cf](https://github.com/angular/zone.js/commit/d85d2cf))
* minor fixes ([18f5511](https://github.com/angular/zone.js/commit/18f5511))


### Code Refactoring

* split zone.js into CJS modules, add zone-microtask.js ([2e52900](https://github.com/angular/zone.js/commit/2e52900))


### Features

* **scheduling:** Prefer MutationObserver over Promise in FF ([038bdd9](https://github.com/angular/zone.js/commit/038bdd9))
* **scheduling:** Support Promise.then() fallbacks to enqueue a microtask ([74eff1c](https://github.com/angular/zone.js/commit/74eff1c))
* add isRootZone api ([bf925bf](https://github.com/angular/zone.js/commit/bf925bf))
* make root zone id to be 1 ([605e213](https://github.com/angular/zone.js/commit/605e213))


### BREAKING CHANGES

* New child zones are now created only from a async task
that installed a custom zone.

Previously even without a custom zone installed (e.g.
LongStacktracesZone), we would spawn new
child zones for all asynchronous events. This is undesirable and
generally not useful.

It does not make sense for us to create new zones for callbacks from the
root zone since we care
only about callbacks from installed custom zones. This reduces the
overhead of zones.

This primarily means that LongStackTraces zone won't be able to trace
events back to Zone.init(),
but instead the starting point will be the installation of the
LongStacktracesZone. In all practical
situations this should be sufficient.
* zone.js as well as *-zone.js files are moved from / to dist/



<a name="0.4.4"></a>
## [0.4.4](https://github.com/angular/zone.js/compare/v0.4.3...v0.4.4) (2015-05-07)


### Bug Fixes

* commonjs wrapper ([7b4fdde](https://github.com/angular/zone.js/commit/7b4fdde)), closes [#19](https://github.com/angular/zone.js/issues/19)
* fork the zone in first example (README) ([7b6e8ed](https://github.com/angular/zone.js/commit/7b6e8ed))
* prevent aliasing original window reference ([63b42bd](https://github.com/angular/zone.js/commit/63b42bd))
* use strcit mode for the zone.js code only ([16855e5](https://github.com/angular/zone.js/commit/16855e5))
* **test:** use console.log rather than dump in tests ([490e6dd](https://github.com/angular/zone.js/commit/490e6dd))
* **websockets:** patch websockets via descriptors ([d725f46](https://github.com/angular/zone.js/commit/d725f46)), closes [#81](https://github.com/angular/zone.js/issues/81)
* **websockets:** properly patch websockets in Safari 7.0 ([3ba6fa1](https://github.com/angular/zone.js/commit/3ba6fa1)), closes [#88](https://github.com/angular/zone.js/issues/88)
* **websockets:** properly patch websockets on Safari 7.1 ([1799a20](https://github.com/angular/zone.js/commit/1799a20))


### Features

* add websockets example ([edb17d2](https://github.com/angular/zone.js/commit/edb17d2))
* log a warning if we suspect duplicate Zone install ([657f6fe](https://github.com/angular/zone.js/commit/657f6fe))



<a name="0.4.3"></a>
## [0.4.3](https://github.com/angular/zone.js/compare/v0.4.2...v0.4.3) (2015-04-08)


### Bug Fixes

* **zone:** keep argument[0] refs around. ([48573ff](https://github.com/angular/zone.js/commit/48573ff))



<a name="0.4.2"></a>
## [0.4.2](https://github.com/angular/zone.js/compare/v0.4.1...v0.4.2) (2015-03-27)


### Bug Fixes

* **zone.js:** don't make function declaration in block scope ([229fd8f](https://github.com/angular/zone.js/commit/229fd8f)), closes [#53](https://github.com/angular/zone.js/issues/53) [#54](https://github.com/angular/zone.js/issues/54)


### Features

* **bindPromiseFn:** add bindPromiseFn method ([643f2ac](https://github.com/angular/zone.js/commit/643f2ac)), closes [#49](https://github.com/angular/zone.js/issues/49)
* **lstz:** allow getLongStacktrace to be called with zero args ([26a4dc2](https://github.com/angular/zone.js/commit/26a4dc2)), closes [#47](https://github.com/angular/zone.js/issues/47)
* **Zone:** add unique id to each zone ([fb338b6](https://github.com/angular/zone.js/commit/fb338b6)), closes [#45](https://github.com/angular/zone.js/issues/45)



<a name="0.4.1"></a>
## [0.4.1](https://github.com/angular/zone.js/compare/v0.4.0...v0.4.1) (2015-02-20)


### Bug Fixes

* **patchViaPropertyDescriptor:** disable if properties are not configurable ([fb5e644](https://github.com/angular/zone.js/commit/fb5e644)), closes [#42](https://github.com/angular/zone.js/issues/42)



<a name="0.4.0"></a>
# [0.4.0](https://github.com/angular/zone.js/compare/v0.3.0...v0.4.0) (2015-02-04)


### Bug Fixes

* **WebSocket:** patch WebSocket instance ([7b8e1e6](https://github.com/angular/zone.js/commit/7b8e1e6))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/angular/zone.js/compare/v0.2.4...v0.3.0) (2014-06-12)


### Bug Fixes

* add events for webgl contexts ([4b6e411](https://github.com/angular/zone.js/commit/4b6e411))
* bind prototype chain callback of custom element descriptor ([136e518](https://github.com/angular/zone.js/commit/136e518))
* dequeue tasks from the zone that enqueued it ([f127fd4](https://github.com/angular/zone.js/commit/f127fd4))
* do not reconfig property descriptors of prototypes ([e9dfbed](https://github.com/angular/zone.js/commit/e9dfbed))
* patch property descriptors in Object.create ([7b7258b](https://github.com/angular/zone.js/commit/7b7258b)), closes [#24](https://github.com/angular/zone.js/issues/24)
* support mozRequestAnimationFrame ([886f67d](https://github.com/angular/zone.js/commit/886f67d))
* wrap non-configurable custom element callbacks ([383b479](https://github.com/angular/zone.js/commit/383b479)), closes [#24](https://github.com/angular/zone.js/issues/24)
* wrap Object.defineProperties ([f587f17](https://github.com/angular/zone.js/commit/f587f17)), closes [#24](https://github.com/angular/zone.js/issues/24)



<a name="0.2.4"></a>
## [0.2.4](https://github.com/angular/zone.js/compare/v0.2.3...v0.2.4) (2014-05-23)



<a name="0.2.3"></a>
## [0.2.3](https://github.com/angular/zone.js/compare/v0.2.2...v0.2.3) (2014-05-23)


### Bug Fixes

* remove dump ([45fb7ba](https://github.com/angular/zone.js/commit/45fb7ba))



<a name="0.2.2"></a>
## [0.2.2](https://github.com/angular/zone.js/compare/v0.2.1...v0.2.2) (2014-05-22)


### Bug Fixes

* correctly detect support for document.registerElement ([ab1d487](https://github.com/angular/zone.js/commit/ab1d487))
* dont automagically dequeue on setInterval ([da99e15](https://github.com/angular/zone.js/commit/da99e15))
* fork should deep clone objects ([21b47ae](https://github.com/angular/zone.js/commit/21b47ae))
* support MutationObserver.disconnect ([ad711b8](https://github.com/angular/zone.js/commit/ad711b8))


### Features

* add stackFramesFilter to longStackTraceZone ([7133de0](https://github.com/angular/zone.js/commit/7133de0))
* expose hooks for enqueuing and dequing tasks ([ba72f34](https://github.com/angular/zone.js/commit/ba72f34))
* improve countingZone and example ([86328fb](https://github.com/angular/zone.js/commit/86328fb))
* support document.registerElement ([d3c785a](https://github.com/angular/zone.js/commit/d3c785a)), closes [#18](https://github.com/angular/zone.js/issues/18)



<a name="0.2.1"></a>
## [0.2.1](https://github.com/angular/zone.js/compare/v0.2.0...v0.2.1) (2014-04-24)


### Bug Fixes

* add support for WebKitMutationObserver ([d1a2c8e](https://github.com/angular/zone.js/commit/d1a2c8e))
* preserve setters when wrapping XMLHttpRequest ([fb46688](https://github.com/angular/zone.js/commit/fb46688)), closes [#17](https://github.com/angular/zone.js/issues/17)



<a name="0.2.0"></a>
# [0.2.0](https://github.com/angular/zone.js/compare/v0.1.1...v0.2.0) (2014-04-17)


### Bug Fixes

* patch all properties on the proto chain ([b6d76f0](https://github.com/angular/zone.js/commit/b6d76f0))
* patch MutationObserver ([1c4e85e](https://github.com/angular/zone.js/commit/1c4e85e))
* wrap XMLHttpRequest when we cant patch protos ([76de58e](https://github.com/angular/zone.js/commit/76de58e))


### Features

* add exceptZone ([b134391](https://github.com/angular/zone.js/commit/b134391))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/angular/zone.js/compare/v0.1.0...v0.1.1) (2014-03-31)


### Features

* add commonjs support ([0fe349e](https://github.com/angular/zone.js/commit/0fe349e))



<a name="0.1.0"></a>
# [0.1.0](https://github.com/angular/zone.js/compare/v0.0.0...v0.1.0) (2014-03-31)


### Bug Fixes

* improve patching browsers with EventTarget ([7d3a8b1](https://github.com/angular/zone.js/commit/7d3a8b1))
* improve stacktrace capture on Safari ([46a6fbc](https://github.com/angular/zone.js/commit/46a6fbc))
* long stack trace test ([01ce3b3](https://github.com/angular/zone.js/commit/01ce3b3))
* prevent calling addEventListener on non-functions ([7acebca](https://github.com/angular/zone.js/commit/7acebca))
* throw if a zone does not define an onError hook ([81d5f49](https://github.com/angular/zone.js/commit/81d5f49))
* throw if a zone does not define an onError hook ([3485c1b](https://github.com/angular/zone.js/commit/3485c1b))


### Features

* add decorator syntax ([c6202a1](https://github.com/angular/zone.js/commit/c6202a1))
* add onZoneCreated hook ([f7badb6](https://github.com/angular/zone.js/commit/f7badb6))
* patch onclick in Chrome and Safari ([7205295](https://github.com/angular/zone.js/commit/7205295))
* refactor and test counting zone ([648a95d](https://github.com/angular/zone.js/commit/648a95d))
* support Promise ([091f44e](https://github.com/angular/zone.js/commit/091f44e))



<a name="0.0.0"></a>
# 0.0.0 (2013-09-18)



