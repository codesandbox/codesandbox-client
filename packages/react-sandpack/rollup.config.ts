import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import camelCase from 'lodash.camelcase';
import typescript from 'rollup-plugin-typescript2';
import uglify from 'rollup-plugin-uglify';

const pkg = require('./package.json');

const libraryName = 'react-sandpack';

const minify = Boolean(process.env.BUILD_MINIFY);

function getFileName(name) {
  if (minify) {
    return name.replace('.js', '.min.js');
  }

  return name;
}

function getConfig({ isUMD }) {
  return {
    input: `src/${libraryName}.ts`,
    output: [
      isUMD
        ? {
            file: getFileName(pkg.main.replace('.js', '.umd.js')),
            name: camelCase(libraryName),
            format: 'umd',
          }
        : { file: getFileName(pkg.main), format: 'cjs' },
    ],
    sourcemap: true,
    watch: {
      include: 'src/**',
    },
    external: isUMD ? [] : id => id === 'react' || /codemirror/.test(id),
    plugins: [
      // Compile TypeScript files
      typescript({ useTsconfigDeclarationDir: true }),
      // Allow bundling cjs modules (unlike webpack, rollup doesn't understand cjs)
      isUMD && commonjs(),
      // Allow node_modules resolution, so you can use 'external' to control
      // which external modules to include in the bundle
      // https://github.com/rollup/rollup-plugin-node-resolve#usage
      isUMD && resolve(),

      // Resolve source maps to the original source
      sourceMaps(),

      minify && uglify(),
    ],
  };
}

export default [getConfig({ isUMD: false }), getConfig({ isUMD: true })];
