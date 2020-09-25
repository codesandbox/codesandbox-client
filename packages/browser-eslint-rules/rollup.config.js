import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import ignore from 'rollup-plugin-ignore';
import replace from '@rollup/plugin-replace';

module.exports = ['eslint-plugin-vue', 'vue-eslint-parser'].map(name => ({
  input: name,
  output: {
    file: `lib/${name}.js`,
    format: 'es',
  },
  external: ['eslint'],

  plugins: [
    replace({
      delimiters: ['', ''],
      'process.versions.node': JSON.stringify('10.10.0'),
      [`require.resolve('./`]: `require('./`,
      [`require.resolve`]: '',
      'commonjsRequire(parserOptions.parser)': `self.globalRequire(parserOptions.parser)`,
    }),
    nodeResolve(),
    commonjs(),
    json(),
    ignore(['inspector']),
  ],
}));
