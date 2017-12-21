import BabelWorker from 'worker-loader?name=babel-transpiler.[hash].worker.js!./eval/transpilers/babel/babel-worker.js';

window.babelworkers = [];
for (let i = 0; i < 3; i++) {
  window.babelworkers.push(new BabelWorker());
}
