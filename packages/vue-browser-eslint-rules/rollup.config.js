import commonjs from '@rollup/plugin-commonjs';
import nodeResolve from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';
import builtIns from 'rollup-plugin-node-builtins';

export default {
  input: 'eslint-plugin-vue',
  output: {
    dir: 'lib',
    format: 'es',
  },

  plugins: [nodeResolve(), commonjs(), json()],
};
