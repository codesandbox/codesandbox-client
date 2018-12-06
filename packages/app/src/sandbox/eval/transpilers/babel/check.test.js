import { shouldTranspile } from './check';

describe('shouldTranspile', () => {
  it('does have to transpile clear jsx', () => {
    const code = `
    <div></div>`;

    expect(shouldTranspile(code, '')).toBe(true);
  });

  it("doesn't have to transpile comments with jsx", () => {
    const code = `
        // Setting .type throws on non-<input> tags`;

    expect(shouldTranspile(code, '')).toBe(false);
  });
});
