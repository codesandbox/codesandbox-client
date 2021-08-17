import { Preset } from './index';
import { Transpiler } from '../transpiler';
import { LoaderContext } from '../transpiled-module';

function createDummyTranspiler(name: string) {
  const Klass = class Trans extends Transpiler {
    constructor() {
      super(name);
    }

    doTranspilation(code: string, loaderContext: LoaderContext) {
      return Promise.resolve({ transpiledCode: code });
    }
  };

  return new Klass();
}

describe('preset', () => {
  let evaluator: {
    evaluate: jest.Mock;
  };
  beforeEach(() => {
    evaluator = {
      evaluate: jest.fn(),
    };
  });
  describe('loaders', () => {
    it('tries to resolve loader dynamically if not found', () => {
      const preset = new Preset('test', [], {});
      const module = {
        path: 'test.js',
        code: '',
      };
      preset.getLoaders(module, evaluator, '!mdx-loader!');
      expect(evaluator.evaluate).toHaveBeenCalledWith('mdx-loader');
    });

    it("doesn't use dynamic loader if it's not needed", () => {
      const preset = new Preset('test', [], {});
      preset.registerTranspiler(() => false, [
        { transpiler: createDummyTranspiler('babel-loader') },
      ]);
      const module = {
        path: 'test.js',
        url: 'https://csb.io/test.js',
        code: '',
      };
      preset.getLoaders(module, evaluator, '!babel-loader!');
      expect(evaluator.evaluate).not.toHaveBeenCalled();
    });
  });

  describe('query', () => {
    const preset = new Preset('test', [], {});

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
        url: 'https://csb.io/test.js',
        code: '',
      };

      expect(preset.getQuery(module, evaluator)).toEqual('!babel-loader');
    });

    it('generates the right query for 2 transpiler', () => {
      const module = {
        path: 'test.css',
        code: '',
      };

      expect(preset.getQuery(module, evaluator)).toEqual(
        '!modules-loader!style-loader'
      );
    });

    it('generates the right query for absolute custom query', () => {
      const module = {
        path: 'test.css',
        url: 'https://csb.io/test.css',
        code: '',
      };

      expect(preset.getQuery(module, evaluator, '!babel-loader')).toEqual(
        '!babel-loader'
      );
    });

    it('generates the right query for custom query', () => {
      const module = {
        path: 'test.css',
        url: 'https://csb.io/test.css',
        code: '',
      };

      expect(preset.getQuery(module, evaluator, 'babel-loader')).toEqual(
        '!babel-loader!modules-loader!style-loader'
      );
    });
  });

  describe('alias', () => {
    function createPreset(aliases: { [p: string]: string }) {
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
