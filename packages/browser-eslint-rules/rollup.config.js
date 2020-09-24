import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtIns from 'rollup-plugin-node-builtins';
import ignore from 'rollup-plugin-ignore';
import replace from '@rollup/plugin-replace';

module.exports = [
  'eslint-plugin-vue',
  '@typescript-eslint/eslint-plugin',
  '@typescript-eslint/parser',
].map(name => ({
  input: name,
  output: {
    file: `lib/${name}.js`,
    format: 'cjs',
  },

  plugins: [
    nodeResolve(),
    commonjs(),
    json(),
    ignore(['inspector']),
    replace({
      'process.versions.node': JSON.stringify('10.10.0'),
    }),
  ],
}));
