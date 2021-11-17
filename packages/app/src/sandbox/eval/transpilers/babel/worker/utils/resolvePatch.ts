import { resolver } from 'sandpack-core/lib/resolver/resolver';
import gensync from 'gensync';

function transformOptions(opts: any, fs: any): any {
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
    isFile: gensync({
      sync: p => isFile(p),
    }),
    readFile: gensync({
      sync: p => fs.readFileSync(p, 'utf8'),
    }),
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
        const resolved = target.sync(p, resolverOptions);
        return resolved;
      };
    },
  };

  return new Proxy(resolver, handler);
}
