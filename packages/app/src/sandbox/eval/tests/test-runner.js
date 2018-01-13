// @flow
export default class TestRunner {
  tests: Array;
  transpiledTests: Array;
  results: Array;
  manager: Manager;

  constructor(manager) {
    console.log('TR: Constructor');
    this.tests = [];
    this.results = [];
    this.manager = manager;
  }

  findTests(modules) {
    console.log('TR: findTests');
    this.tests = modules.filter(m => {
      return m.path.endsWith('.spec.js');
    });
  }

  async transpileTests() {
    console.log('TR: transpileTests');
    for (let t of this.tests) {
      await this.manager.transpileModules(t);
    }
  }

  runTests() {
    console.log('TR: runTests');
    this.tests.forEach(t => {
      this.manager.evaluateModule(t);
    });
  }

  addResult(result) {
    console.log('TR: addResult');
    this.results.push(result);
  }

  reportResults() {
    console.log('TR: Report');
    return this.results;
  }

  resetResults() {
    console.log('TR: resetResults');
    this.results = [];
  }
}
