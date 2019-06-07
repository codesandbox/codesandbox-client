"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var child_process_1 = require("child_process");
var path_1 = require("path");
var semver = require("semver");
var ts = require("typescript");
var proxyquire = require("proxyquire");
var index_1 = require("./index");
var testDir = path_1.join(__dirname, '../tests');
var EXEC_PATH = path_1.join(__dirname, '../dist/bin');
var BIN_EXEC = "node \"" + EXEC_PATH + "\" --project \"" + testDir + "/tsconfig.json\"";
var SOURCE_MAP_REGEXP = /\/\/# sourceMappingURL=data:application\/json;charset=utf\-8;base64,[\w\+]+=*$/;
describe('ts-node', function () {
    this.timeout(10000);
    it('should export the correct version', function () {
        chai_1.expect(index_1.VERSION).to.equal(require('../package.json').version);
    });
    describe('cli', function () {
        this.slow(1000);
        it('should execute cli', function (done) {
            child_process_1.exec(BIN_EXEC + " tests/hello-world", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('Hello, world!\n');
                return done();
            });
        });
        it('should register via cli', function (done) {
            child_process_1.exec("node -r ../register hello-world.ts", {
                cwd: testDir
            }, function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('Hello, world!\n');
                return done();
            });
        });
        it('should execute cli with absolute path', function (done) {
            child_process_1.exec(BIN_EXEC + " \"" + path_1.join(testDir, 'hello-world') + "\"", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('Hello, world!\n');
                return done();
            });
        });
        it('should print scripts', function (done) {
            child_process_1.exec(BIN_EXEC + " -p \"import { example } from './tests/complex/index';example()\"", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('example\n');
                return done();
            });
        });
        if (semver.gte(ts.version, '1.8.0')) {
            it('should allow js', function (done) {
                child_process_1.exec([
                    BIN_EXEC,
                    '-O "{\\\"allowJs\\\":true}"',
                    '-p "import { main } from \'./tests/allow-js/run\';main()"'
                ].join(' '), function (err, stdout) {
                    chai_1.expect(err).to.equal(null);
                    chai_1.expect(stdout).to.equal('hello world\n');
                    return done();
                });
            });
            it('should include jsx when `allow-js` true', function (done) {
                child_process_1.exec([
                    BIN_EXEC,
                    '-O "{\\\"allowJs\\\":true}"',
                    '-p "import { Foo2 } from \'./tests/allow-js/with-jsx\'; Foo2.sayHi()"'
                ].join(' '), function (err, stdout) {
                    chai_1.expect(err).to.equal(null);
                    chai_1.expect(stdout).to.equal('hello world\n');
                    return done();
                });
            });
        }
        it('should eval code', function (done) {
            child_process_1.exec(BIN_EXEC + " -e \"import * as m from './tests/module';console.log(m.example('test'))\"", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('TEST\n');
                return done();
            });
        });
        it('should import empty files', function (done) {
            child_process_1.exec(BIN_EXEC + " -e \"import './tests/empty'\"", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('');
                return done();
            });
        });
        it('should throw errors', function (done) {
            child_process_1.exec(BIN_EXEC + " -e \"import * as m from './tests/module';console.log(m.example(123))\"", function (err) {
                if (err === null) {
                    return done('Command was expected to fail, but it succeeded.');
                }
                chai_1.expect(err.message).to.match(new RegExp('TS2345: Argument of type \'(?:number|123)\' ' +
                    'is not assignable to parameter of type \'string\'\\.'));
                return done();
            });
        });
        it('should be able to ignore diagnostic', function (done) {
            child_process_1.exec(BIN_EXEC + " --ignoreDiagnostics 2345 -e \"import * as m from './tests/module';console.log(m.example(123))\"", function (err) {
                if (err === null) {
                    return done('Command was expected to fail, but it succeeded.');
                }
                chai_1.expect(err.message).to.match(/TypeError: (?:(?:undefined|foo\.toUpperCase) is not a function|.*has no method \'toUpperCase\')/);
                return done();
            });
        });
        it('should work with source maps', function (done) {
            child_process_1.exec(BIN_EXEC + " tests/throw", function (err) {
                if (err === null) {
                    return done('Command was expected to fail, but it succeeded.');
                }
                chai_1.expect(err.message).to.contain([
                    path_1.join(__dirname, '../tests/throw.ts') + ":3",
                    '  bar () { throw new Error(\'this is a demo\') }',
                    '                 ^',
                    'Error: this is a demo'
                ].join('\n'));
                return done();
            });
        });
        it.skip('eval should work with source maps', function (done) {
            child_process_1.exec(BIN_EXEC + " -p \"import './tests/throw'\"", function (err) {
                if (err === null) {
                    return done('Command was expected to fail, but it succeeded.');
                }
                chai_1.expect(err.message).to.contain([
                    path_1.join(__dirname, '../tests/throw.ts') + ":3",
                    '  bar () { throw new Error(\'this is a demo\') }',
                    '                 ^'
                ].join('\n'));
                return done();
            });
        });
        it('should support transpile only mode', function (done) {
            child_process_1.exec(BIN_EXEC + " --transpileOnly -p \"x\"", function (err) {
                if (err === null) {
                    return done('Command was expected to fail, but it succeeded.');
                }
                chai_1.expect(err.message).to.contain('ReferenceError: x is not defined');
                return done();
            });
        });
        it('should pipe into `ts-node` and evaluate', function (done) {
            var cp = child_process_1.exec(BIN_EXEC, function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('hello\n');
                return done();
            });
            cp.stdin.end("console.log('hello')");
        });
        it('should pipe into `ts-node`', function (done) {
            var cp = child_process_1.exec(BIN_EXEC + " -p", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('true\n');
                return done();
            });
            cp.stdin.end('true');
        });
        it('should pipe into an eval script', function (done) {
            var cp = child_process_1.exec(BIN_EXEC + " --fast -p 'process.stdin.isTTY'", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('undefined\n');
                return done();
            });
            cp.stdin.end('true');
        });
        it('should support require flags', function (done) {
            child_process_1.exec(BIN_EXEC + " -r ./tests/hello-world -p \"console.log('success')\"", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('Hello, world!\nsuccess\nundefined\n');
                return done();
            });
        });
        it('should support require from node modules', function (done) {
            child_process_1.exec(BIN_EXEC + " -r typescript -e \"console.log('success')\"", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('success\n');
                return done();
            });
        });
        it.skip('should use source maps with react tsx', function (done) {
            child_process_1.exec(BIN_EXEC + " -r ./tests/emit-compiled.ts tests/jsx-react.tsx", function (err, stdout) {
                chai_1.expect(err).to.equal(null);
                chai_1.expect(stdout).to.equal('todo');
                return done();
            });
        });
        it('should allow custom typings', function (done) {
            child_process_1.exec(BIN_EXEC + " tests/custom-types", function (err, stdout) {
                chai_1.expect(err).to.match(/Error: Cannot find module 'does-not-exist'/);
                return done();
            });
        });
    });
    describe('register', function () {
        index_1.register({
            project: path_1.join(testDir, 'tsconfig.json'),
            compilerOptions: {
                jsx: 'preserve'
            }
        });
        it('should be able to require typescript', function () {
            var m = require('../tests/module');
            chai_1.expect(m.example('foo')).to.equal('FOO');
        });
        it('should compile through js and ts', function () {
            var m = require('../tests/complex');
            chai_1.expect(m.example()).to.equal('example');
        });
        it('should work with proxyquire', function () {
            var m = proxyquire('../tests/complex', {
                './example': 'hello'
            });
            chai_1.expect(m.example()).to.equal('hello');
        });
        it('should use source maps', function (done) {
            try {
                require('../tests/throw');
            }
            catch (error) {
                chai_1.expect(error.stack).to.contain([
                    'Error: this is a demo',
                    "    at Foo.bar (" + path_1.join(__dirname, '../tests/throw.ts') + ":3:18)"
                ].join('\n'));
                done();
            }
        });
        describe('JSX preserve', function () {
            var old = require.extensions['.tsx'];
            var compiled;
            before(function () {
                var _this = this;
                require.extensions['.tsx'] = function (m, fileName) {
                    var _compile = m._compile;
                    m._compile = function (code, fileName) {
                        compiled = code;
                        return _compile.call(_this, code, fileName);
                    };
                    return old(m, fileName);
                };
            });
            after(function () {
                require.extensions['.tsx'] = old;
            });
            it('should use source maps', function (done) {
                try {
                    require('../tests/with-jsx.tsx');
                }
                catch (error) {
                    chai_1.expect(error.stack).to.contain('SyntaxError: Unexpected token <\n');
                }
                chai_1.expect(compiled).to.match(SOURCE_MAP_REGEXP);
                done();
            });
        });
    });
});
//# sourceMappingURL=index.spec.js.map