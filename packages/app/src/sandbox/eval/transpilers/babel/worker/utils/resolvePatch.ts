import { resolveSync, IResolveOptionsInput } from 'sandpack-core/lib/resolver';

function transformOptions(opts: any, fs: any): IResolveOptionsInput {
  const isFile = p => {
    try {
      const stats = fs.statSync(p);
      return stats.isFile();
    } catch (err) {
      return false;
    }
  };

  const basedir = opts.basePath || opts.basedir;
  const filename = basedir ? basedir + '/index.js' : opts.filename;
  return {
    filename: filename || '/index.js',
    extensions: opts.extensions
      ? opts.extensions
      : ['.js', '.cjs', '.mjs', '.json', '.ts', '.tsx'],
    moduleDirectories: ['node_modules'],
    isFile: async p => isFile(p),
    isFileSync: isFile,
    readFile: async p => fs.readFileSync(p, 'utf8'),
    readFileSync: p => fs.readFileSync(p, 'utf8'),
  };
}

/**
 * Patch 'resolve' to configure it to resolve esmodules by default. babel-plugin-macros goes
 * for the commonjs version, which we don't download anymore by default.
 */
export function patchedResolve() {
  const fs = global.BrowserFS.BFSRequire('fs');

  const handler = {
    get(target, prop) {
      return (p, options) => {
        const resolverOptions = transformOptions(options, fs);
        const resolved = resolveSync(p, resolverOptions);
        return resolved;
      };
    },
  };

  return new Proxy({ sync: null, async: null }, handler);
}
