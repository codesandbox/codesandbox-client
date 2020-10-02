import typescript from '@rollup/plugin-typescript';
import alias from '@rollup/plugin-alias';

export default {
  input: './src/index.ts',
  output: {
    dir: 'lib',
    format: 'es',
  },

  plugins: [
    alias({
      entries: {
        '@vue/compiler-sfc':
          '@vue/compiler-sfc/dist/compiler-sfc.esm-browser.js',
      },
    }),
    typescript(),
  ],
};
