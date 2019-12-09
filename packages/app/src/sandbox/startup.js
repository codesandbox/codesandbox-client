/* eslint-disable import/default */
import BabelWorker from 'worker-loader?publicPath=/&name=babel-transpiler.[hash:8].worker.js!./eval/transpilers/babel/worker/index';
/* eslint-enable import/default */

window.babelworkers = [];
for (let i = 0; i < 3; i++) {
  window.babelworkers.push(new BabelWorker());
}
