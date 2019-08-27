import Preset from './index';

import Transpiler from '../transpilers/index';

function createDummyTranspiler(name: string) {
  const Klass = class Trans extends Transpiler {
    constructor() {
      super(name);
    }
  };

  return new Klass();
}

describe('sandbox', () => {
  describe('preset', () => {
    describe('query', () => {
      const preset = new Preset('test', [], []);

      preset.registerTranspiler(t => t.path.endsWith('.js'), [
        { transpiler: createDummyTranspiler('babel-loader') },
      ]);
      preset.registerTranspiler(t => t.path.endsWith('.css'), [
        { transpiler: createDummyTranspiler('style-loader') },
        { transpiler: createDummyTranspiler('modules-loader') },
      ]);

      it('generates the right query for 1 transpiler', () => {
        const module = {
          path: 'test.js',
          code: '',
        };

        expect(preset.getQuery(module)).toEqual('!babel-loader');
      });

      it('generates the right query for 2 transpiler', () => {
        const module = {
          path: 'test.css',
          code: '',
        };

        expect(preset.getQuery(module)).toEqual('!style-loader!modules-loader');
      });

      it('generates the right query for absolute custom query', () => {
        const module = {
          path: 'test.css',
          code: '',
        };

        expect(preset.getQuery(module, '!babel-loader')).toEqual(
          '!babel-loader'
        );
      });

      it('generates the right query for custom query', () => {
        const module = {
          path: 'test.css',
          code: '',
        };

        expect(preset.getQuery(module, 'babel-loader')).toEqual(
          '!style-loader!modules-loader!babel-loader'
        );
      });
    });

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

      describe('exact alias', () => {
        it('resolves an exact alias', () => {
          const preset = createPreset({
            vue$: 'vue/common/dist',
          });

          expect(preset.getAliasedPath('vue')).toBe('vue/common/dist');
        });

        it("doesnt't resolve a not exact alias", () => {
          const preset = createPreset({
            vue$: 'vue/common/dist',
          });

          expect(preset.getAliasedPath('vue/test')).toBe('vue/test');
        });
      });
    });
  });
});
