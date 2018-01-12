// @flow
export default class TestManager {
  tests: Array;
  transpiledTests: Array;
  results: Array;
  manager: Manager;

  constructor({ manager }) {
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
      await manager.transpileModules(t);
    }
  }

  runTests() {
    console.log('TM: runTests');
    this.tests.forEach(t => {
      const result = manager.evaluateModule(t);
      // const result = this.executeModule(t.code); //TODO - need to find a way to execute a module and get result
      this.results.push(result);
    });
  }

  executeModule(t) {
    //TODO
  }

  resetResults() {
    console.log('TM: resetResults');
    this.results = [];
  }

  report() {
    console.log('TM: Report');
    return this.results;
  }
}
