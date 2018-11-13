import * as BrowserFS from '../../src/core/browserfs';
import {FileSystem} from '../../src/core/file_system';
import BackendFactory from './BackendFactory';
import {eachSeries as asyncEachSeries} from 'async';
import BFSEmscriptenFS from '../../src/generic/emscripten_fs';
import assert from './wrapped-assert';
import loadFixtures from '../fixtures/load_fixtures';

declare var __numWaiting: number;
declare var __karma__: any;
// HACK: Delay test execution until backends load.
// https://zerokspot.com/weblog/2013/07/12/delay-test-execution-in-karma/
__karma__.loaded = function() {};

// Test timeout duration in milliseconds. Increase if needed.
var timeout: number = 180000;

function waitsFor(test: () => boolean, what: string, timeout: number, done: (e?: Error) => void) {
  var interval = setInterval(() => {
    if (test()) {
      clearInterval(interval);
      done();
    } else if (0 >= (timeout -= 10)) {
      clearInterval(interval);
      done(new Error(`${what}: Timed out.`));
    }
  }, 10);
}


// Defines and starts all of our unit tests.
export default function(tests: {
    fs: {
      [name: string]: {[name: string]: () => void};
      all: {[name: string]: () => void};
    };
    general: {[name: string]: () => void};
    emscripten: {[name: string]: (Module: any) => void};
  }, backendFactories: BackendFactory[]) {
  var fsBackends: { name: string; backends: FileSystem[]; }[] = [];

  // Install BFS as a global.
  (<any> window)['BrowserFS'] = BrowserFS;

  const process = BrowserFS.BFSRequire('process');
  const fs = BrowserFS.BFSRequire('fs');
  const path = BrowserFS.BFSRequire('path');
  fs.wrapCallbacks((cb, numArgs) => {
    // This is used for unit testing.
    // We could use `arguments`, but Function.call/apply is expensive. And we only
    // need to handle 1-3 arguments
    if (typeof __numWaiting === 'undefined') {
      (<any> global).__numWaiting = 0;
    }
    __numWaiting++;

    switch (numArgs) {
      case 1:
        return <any> function(arg1: any) {
          __numWaiting--;
          return cb(arg1);
        };
      case 2:
        return <any> function(arg1: any, arg2: any) {
          __numWaiting--;
          return cb(arg1, arg2);
        };
      case 3:
        return <any> function(arg1: any, arg2: any, arg3: any) {
          __numWaiting--;
          return cb(arg1, arg2, arg3);
        };
      default:
        throw new Error('Invalid invocation of wrapCb.');
    }
  });

  // Generates a Jasmine unit test from a CommonJS test.
  function generateTest(testName: string, test: () => void, postCb: () => void = () => {}) {
    it(testName, function (done: (e?: any) => void) {
      // Reset the exit callback.
      process.removeAllListeners('exit');
      test();
      waitsFor(() => {
        return __numWaiting === 0;
      }, "All callbacks should fire", timeout, (e?: Error) => {
        if (e) {
          postCb();
          done(e);
        } else {
          // Run the exit callback, if any.
          process.exit(0);
          process.removeAllListeners('exit');
          waitsFor(() => {
            return __numWaiting === 0;
          }, "All callbacks should fire", timeout, (e?: Error) => {
            postCb();
            done(e);
          });
        }
      });
    });
  }

  function generateEmscriptenTest(testName: string, test: (module: any) => void) {
    // Only applicable to typed array-compatible browsers.
    if (typeof(Uint8Array) !== 'undefined') {
      it(`[Emscripten] Initialize FileSystem`, (done) => {
        BrowserFS.configure({ fs: 'InMemory' }, done);
      });
      generateTest(`[Emscripten] Load fixtures (${testName})`, loadFixtures);
      it(`[Emscripten] ${testName}`, function(done: (e?: any) => void) {
        let stdout = "";
        let stderr = "";
        let expectedStdout: string = null;
        let expectedStderr: string = null;
        let testNameNoExt = testName.slice(0, testName.length - path.extname(testName).length);
        try {
          expectedStdout = fs.readFileSync(`/test/fixtures/files/emscripten/${testNameNoExt}.out`).toString().replace(/\r/g, '');
          expectedStderr = fs.readFileSync(`/test/fixtures/files/emscripten/${testNameNoExt}.err`).toString().replace(/\r/g, '');
        } catch (e) {
          // No stdout/stderr test.
        }

        const Module = {
          // Explicitly override arguments, since newer Emscripten versions
          // will incorrectly default it to the arguments object passed to
          // the module we enclose the program in, and then try to coerce
          // everything into a string (bad)
          arguments: <string[]> [],
          print: function(text: string) { stdout += text + '\n'; },
          printErr: function(text: string) { stderr += text + '\n'; },
          onExit: function(code: number) {
            if (code !== 0) {
              done(new Error(`Program exited with code ${code}.\nstdout:\n${stdout}\nstderr:\n${stderr}`));
            } else {
              if (expectedStdout !== null) {
                assert.equal(stdout.trim(), expectedStdout.trim());
                assert.equal(stderr.trim(), expectedStderr.trim());
              }
              done();
            }
          },
          // Block standard input. Otherwise, the unit tests inexplicably read from stdin???
          stdin: function(): any {
            return null;
          },
          locateFile: function(fname: string): string {
            return `/test/tests/emscripten/${fname}`;
          },
          preRun: function() {
            const FS = Module.FS;
            const BFS = new BFSEmscriptenFS(FS, Module.PATH, Module.ERRNO_CODES);
            FS.mkdir('/files');
            // console.log(BrowserFS.BFSRequire('fs').readdirSync('/test/fixtures/files/emscripten'));
            FS.mount(BFS, {root: '/test/fixtures/files/emscripten'}, '/files');
            FS.chdir('/files');
          },
          ENVIRONMENT: "WEB",
          FS: <any> undefined,
          PATH: <any> undefined,
          ERRNO_CODES: <any> undefined
        };
        test(Module);
      });
    }
  }

  function generateBackendTests(name: string, backend: FileSystem) {
    var testName: string;
    generateTest("Load filesystem", function () {
      __numWaiting = 0;
      BrowserFS.initialize(backend);
    });
    generateTest("Load fixtures", loadFixtures);
    if (tests.fs.hasOwnProperty(name)) {
      // Generate each unit test specific to this backend.
      for (testName in tests.fs[name]) {
        if (tests.fs[name].hasOwnProperty(testName)) {
          generateTest(testName, tests.fs[name][testName]);
        }
      }
    }
    // Generate unit test for each general FS test.
    for (testName in tests.fs.all) {
      if (tests.fs.all.hasOwnProperty(testName)) {
        generateTest(testName, tests.fs.all[testName]);
      }
    }
  }

  function generateAllTests() {
    describe('BrowserFS Tests', function(): void {
      this.timeout(0);

      // generate generic non-backend specific tests
      describe('General Tests', (): void => {
        var genericTests = tests.general, testName: string;
        __numWaiting = 0;
        for (testName in genericTests) {
          if (genericTests.hasOwnProperty(testName)) {
            // Capture testName in a closure.
            ((testName: string) => {
              generateTest(testName, () => {
                genericTests[testName]();
              });
            })(testName);
          }
        }
      });

      describe('Emscripten Tests', (): void => {
        var emscriptenTests = tests.emscripten;
        Object.keys(emscriptenTests).forEach((testName) => {
          generateEmscriptenTest(testName, emscriptenTests[testName]);
        });
      });

      describe('FS Tests', (): void => {
        fsBackends.forEach((fsBackend) => {
          fsBackend.backends.forEach((backend) => {
            describe(`${fsBackend.name} ${backend.getName()}`, (): void => {
              generateBackendTests(fsBackend.name, backend);
            });
          });
        });
      });
    });

    // Kick off the tests!
    __karma__.start();
  }


  asyncEachSeries(backendFactories, (factory: BackendFactory, cb: (e?: any) => void) => {
    let timeout = setTimeout(() => {
      throw new Error(`Backend ${factory['name']} failed to initialize promptly.`);
    }, 3000000);
    factory((name: string, backends: FileSystem[]) => {
      clearTimeout(timeout);
      fsBackends.push({name: name, backends: backends});
      cb();
    });
  }, (e?: any) => {
    generateAllTests();
  });
};
