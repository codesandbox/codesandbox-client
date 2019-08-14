// rollup.config.js
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'index.js',

  output: {
    file: 'dist/sse-hooks.js',
    format: 'umd',
  },
  plugins: [
    json(),
    babel({
      include: ['node_modules/**', 'sandbox-hooks/**'],
    }),
    resolve(),
    commonjs(),
    terser(),
  ],
};
