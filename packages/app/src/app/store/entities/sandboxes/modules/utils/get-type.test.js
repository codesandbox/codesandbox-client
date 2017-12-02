import getType from './get-type';

describe('modules', () => {
  describe('utils', () => {
    describe('get-type', () => {
      it('detects react with single quotes', () => {
        expect(
          getType('test.js', `import React, { PureComponent } from 'react';`)
        ).toBe('react');
      });

      it('detects react with double quotes', () => {
        expect(
          getType('test.js', `import React, { PureComponent } from "react";`)
        ).toBe('react');
      });

      it("does't detect react with no extension", () => {
        expect(
          getType('test', `import React, { PureComponent } from "react";`)
        ).toBe('raw');
      });

      it('detects javascript with js', () => {
        expect(getType('test.js', '')).toBe('js');
      });

      it('detects javascript with jsx', () => {
        expect(getType('test.jsx', '')).toBe('js');
      });

      it('detects css', () => {
        expect(getType('test.css', '')).toBe('css');
      });

      it('detects json', () => {
        expect(getType('test.json', '')).toBe('json');
      });

      it('detects html', () => {
        expect(getType('test.html', '')).toBe('html');
      });

      it('detects nothing', () => {
        expect(getType('test', '')).toBe('raw');
      });
    });
  });
});
