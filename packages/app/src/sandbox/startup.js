import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./eval/transpilers/babel/worker/index.js';

window.babelworkers = [];
for (let i = 0; i < 2; i++) {
  window.babelworkers.push(new BabelWorker());
}
