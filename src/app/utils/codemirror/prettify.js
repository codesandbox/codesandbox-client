// import { fix } from './eslint-lint';

export default (async function prettify(code, eslintEnabled) {
  const prettier = await System.import('prettier');
  let newCode = prettier.format(code, {
    singleQuote: true,
    trailingComma: 'all',
  });

  if (eslintEnabled) {
    const { fix } = await System.import('app/utils/codemirror/eslint-lint');
    try {
      newCode = fix(newCode).output;
    } catch (e) {
      console.error(e);
    }
  }
  return newCode;
});
