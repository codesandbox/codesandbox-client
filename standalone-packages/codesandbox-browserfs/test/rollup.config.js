import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import buble from 'rollup-plugin-buble';
import {join} from 'path';

const outBase = join(__dirname, '..', 'build', 'temp', 'tests');

export default {
  input: join(outBase, 'ts', 'test', 'harness', 'run.js'),
  output: {
    file: join(outBase, 'rollup', 'test.rollup.js'),
    sourceMap: true,
    format: 'cjs',
    exports: 'named',
    strict: true
  },
  external: [
    'buffer', 'path', 'assert'
  ],
  plugins: [
    alias({
      async: require.resolve('async-es'),
      dropbox_bridge: join(outBase, 'ts', 'src', 'generic', 'dropbox_bridge_actual.js')
    }),
    nodeResolve({
      main: true,
      jsnext: true,
      preferBuiltins: true
    }),
    sourcemaps({
      exclude: '**/*'
    }),
    buble({
      transforms: {
        dangerousForOf: true
      }
    })
  ]
};
