import { generateCode, parseModule } from './utils';

function processCode(code: string): string {
  return generateCode(parseModule(code));
}

describe('printer issues', () => {
  it('can convert + +', () => {
    const code = `
      c = (10.0, + +(15))
      `;

    expect(processCode(code)).toMatchSnapshot();
  });

  it('can convert -(--i)', () => {
    const code = `a = -(--i)`;
    expect(processCode(code)).toBe('"use strict";\na = - --i;\n');
  });

  it('can convert unicode line breaks', () => {
    const code = `const a = "[\\u2028]";`;
    expect(processCode(code)).toBe('"use strict";\nconst a = "[\\u2028]";\n');
  });
});
