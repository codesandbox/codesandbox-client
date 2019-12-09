import sourcemaps from 'rollup-plugin-sourcemaps';
import nodeResolve from 'rollup-plugin-node-resolve';
import alias from 'rollup-plugin-alias';
import buble from 'rollup-plugin-buble';
import {join} from 'path';

const outBase = join(__dirname, '..', 'build', 'temp', 'library');

export default {
  input: join(outBase, 'ts', 'index.js'),
  output: {
    file: join(outBase, 'rollup', 'browserfs.rollup.js'),
    sourceMap: true,
    strict: true,
    format: 'cjs',
    exports: 'named'
  },
  external: [
    'buffer', 'path'
  ],
  plugins: [
    alias({
      async: require.resolve('async-es'),
      events: require.resolve('../node_modules/events'),
      dropbox_bridge: join(outBase, 'ts', 'generic', 'dropbox_bridge_actual.js')
    }),
    nodeResolve({
      mainFields: ['main', 'jsnext:main'],
      preferBuiltins: true
    }),
    sourcemaps(),
    buble({
      transforms: {
        // Assumes all `for of` statements are on arrays or array-like items.
        dangerousForOf: true,
        generator: false
      }
    })
  ]
};
