import cjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';

export default {
  input: 'src/tern.js',
  output: {
    file: 'dist/tern.js',
    format: 'cjs',
  },
  plugins: [cjs(), json(), resolve()],
};
