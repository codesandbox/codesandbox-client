import prettify from './prettify';

const testCode = async (code: string) => {
  const prettified = await prettify(code);
  expect(prettified).toMatchSnapshot();
};

describe('prettify', () => {
  it('should prettify code', async () => {
    await testCode(`const a='32'`);
  });

  it('should prettify static class props', async () => {
    await testCode(
      `
      class Ives extends React.Component {
        property = {

        }
      }
    `,
    );
  });

  it('should prettify syntax errors', async () => {
    await testCode(`apofdawoifefjaweoifj`);
  });
});
