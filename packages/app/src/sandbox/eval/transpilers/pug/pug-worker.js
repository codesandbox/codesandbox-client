import { ChildHandler } from '../worker-transpiler/child-handler';

self.importScripts(
  `${
    process.env.CODESANDBOX_HOST || ''
  }/static/js/browserified-pug.0.1.0.min.js`
);

const childHandler = new ChildHandler();

async function workerCompile(opts) {
  const { code, path } = opts;

  // register a custom importer callback
  const transpiledCode = await new Promise((resolve, reject) => {
    self.pug.render(code, { filename: path }, (err, html) => {
      if (err) {
        return reject(err);
      }

      return resolve(html);
    });
  });

  return {
    transpiledCode,
  };
}

childHandler.registerFunction('compile', workerCompile);
childHandler.emitReady();
