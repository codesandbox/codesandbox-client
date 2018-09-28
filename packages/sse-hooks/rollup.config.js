// rollup.config.js
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: 'index.js',

  output: {
    file: 'dist/index.js',
    format: 'umd',
  },
  plugins: [json(), babel(), resolve(), commonjs(), uglify()],
};
