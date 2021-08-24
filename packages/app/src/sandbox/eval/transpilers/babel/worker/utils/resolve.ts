import {
  resolveSync,
  IResolveOptionsInput,
} from 'sandpack-core/lib/resolver/resolver';
import gensync from 'gensync';

/**
 * Patch 'resolve' to configure it to resolve esmodules by default. babel-plugin-macros goes
 * for the commonjs version, which we don't download anymore by default.
 */
export function resolve(
  specifier: string,
  opts: Partial<IResolveOptionsInput>
) {
  const fs = global.BrowserFS.BFSRequire('fs');

  const resolvedPath = resolveSync(specifier, {
    filename: '/index.js', // idk...
    extensions: ['.js', '.mjs', '.json', '.ts', '.tsx'],
    moduleDirectories: ['node_modules'],
    ...opts,
    isFile: gensync({
      sync: p => {
        try {
          const stats = fs.statSync(p);
          return stats.isFile();
        } catch (err) {
          return false;
        }
      },
    }),
    readFile: gensync({
      sync: p => fs.readFileSync(p),
    }),
  });
  return resolvedPath;
}
