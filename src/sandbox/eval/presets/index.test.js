import Preset from './';

describe('sandbox', () => {
  describe('preset', () => {
    describe('alias', () => {
      function createPreset(aliases) {
        return new Preset('test', [], aliases);
      }

      it('finds the right simple alias', () => {
        const preset = createPreset({
          test: 'test2',
        });

        expect(preset.getAliasedPath('test')).toBe('test2');
      });

      it('chooses the right simple alias', () => {
        const preset = createPreset({
          test: 'test2',
          testtest: 'test4',
        });

        expect(preset.getAliasedPath('testtest')).toBe('test4');
      });

      it('works with paths', () => {
        const preset = createPreset({
          test: 'test2',
          testtest: 'test4',
        });

        expect(preset.getAliasedPath('test/piano/guitar')).toBe(
          'test2/piano/guitar'
        );
      });

      it('works with deeper paths', () => {
        const preset = createPreset({
          test: 'test4',
          'test/piano': 'test2',
        });

        expect(preset.getAliasedPath('test/piano/guitar')).toBe('test2/guitar');
      });

      it('works in a real life scenario', () => {
        const preset = createPreset({
          preact$: 'preact',
          // preact-compat aliases for supporting React dependencies:
          react: 'preact-compat',
          'react-dom': 'preact-compat',
          'create-react-class': 'preact-compat/lib/create-react-class',
          'react-addons-css-transition-group': 'preact-css-transition-group',
        });

        expect(preset.getAliasedPath('react/render')).toBe(
          'preact-compat/render'
        );
      });

      it("doesn't replace partial paths", () => {
        const preset = createPreset({
          preact$: 'preact',
          // preact-compat aliases for supporting React dependencies:
          react: 'preact-compat',
          'react-dom': 'preact-compat',
          'create-react-class': 'preact-compat/lib/create-react-class',
          'react-addons-css-transition-group': 'preact-css-transition-group',
        });

        expect(preset.getAliasedPath('react-foo')).toBe('react-foo');
      });
    });
  });
});
