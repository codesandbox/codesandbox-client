// @flow
export default class TestManager {
  tests: Array;
  transpiledTests: Array;
  results: Array;
  manager: Manager;

  constructor(manager) {
    console.log('TM: Constructor');
    this.tests = [];
    this.results = [];
    this.manager = manager;
  }

  findTests(modules) {
    console.log('TM: findTests');
    this.tests = modules.filter(m => {
      return m.path.endsWith('.spec.js');
    });
  }

  async transpileTests() {
    console.log('TM: transpileTests');
    for (let t of this.tests) {
      await this.manager.transpileModules(t);
    }
  }

  runTests() {
    console.log('TM: runTests');
    this.tests.forEach(t => {
      this.manager.evaluateModule(t);
    });
  }

  addResult(result) {
    console.log('TM: addResult', result);
    this.results.push(result);
  }

  reportResults() {
    console.log('TM: Report');
    return this.results;
  }

  resetResults() {
    console.log('TM: resetResults');
    this.results = [];
  }
}
