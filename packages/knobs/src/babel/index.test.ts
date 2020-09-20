import * as core from '@babel/core';
import babelPlugin from './index';

function validateBabel(code: string) {
  // @ts-ignore
  const { code: outputCode } = core.transformSync(code, {
    plugins: [babelPlugin],
    filename: __dirname + '/test.js',
  });

  expect(outputCode).toMatchSnapshot();
}

it('converts knobs to something new', () => {
  const code = `import * as knobs from 'knobs';
  
  let var1 = knobs.number('padding');
  let var2 = knobs.string('name');
  `;

  validateBabel(code);
});
