import getType from './get-type';

describe('modules', () => {
  describe('utils', () => {
    describe('get-type', () => {
      it('detects react with single quotes', () => {
        const testModule = {
          code: `import React, { PureComponent } from 'react';`,
          title: 'test.js',
        };

        expect(getType(testModule)).toBe('react');
      });

      it('detects react with double quotes', () => {
        const testModule = {
          code: `import React, { PureComponent } from "react";`,
          title: 'test.js',
        };

        expect(getType(testModule)).toBe('react');
      });

      it("does't detect react with no extension", () => {
        const testModule = {
          code: `import React, { PureComponent } from "react";`,
          title: 'test',
        };

        expect(getType(testModule)).toBe('raw');
      });

      it('detects javascript with js', () => {
        const testModule = {
          code: ``,
          title: 'test.js',
        };

        expect(getType(testModule)).toBe('js');
      });

      it('detects javascript with jsx', () => {
        const testModule = {
          code: ``,
          title: 'test.jsx',
        };

        expect(getType(testModule)).toBe('js');
      });

      it('detects css', () => {
        const testModule = {
          code: ``,
          title: 'test.css',
        };

        expect(getType(testModule)).toBe('css');
      });

      it('detects json', () => {
        const testModule = {
          code: ``,
          title: 'test.json',
        };

        expect(getType(testModule)).toBe('json');
      });

      it('detects html', () => {
        const testModule = {
          code: ``,
          title: 'test.html',
        };

        expect(getType(testModule)).toBe('html');
      });

      it('detects nothing', () => {
        const testModule = {
          code: ``,
          title: 'test',
        };

        expect(getType(testModule)).toBe('raw');
      });
    });
  });
});
