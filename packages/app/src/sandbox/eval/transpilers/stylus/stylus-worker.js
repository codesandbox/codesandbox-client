import { ChildHandler } from '../worker-transpiler/child-handler';

const childHandler = new ChildHandler('stylus-worker');

self.importScripts(
  `${process.env.CODESANDBOX_HOST || ''}/static/js/stylus.min.js`
);

declare var stylus: {
  render: (
    code: string,
    { filename: string },
    (err, css: string) => void
  ) => void,
};

async function compile(data) {
  const { code, path } = data;

  const transpiledCode = await new Promise((resolve, reject) => {
    stylus.render(code, { filename: path }, (err, css) => {
      if (err) {
        return reject(err);
      }

      return resolve(css);
    });
  });

  return { transpiledCode };
}

childHandler.registerFunction('compile', compile);
childHandler.emitReady();
