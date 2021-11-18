import path from 'path';
import type { ILessLoaderContext } from './less-worker';

const PKG_IMPORT_RE = /^~?([@A-Za-z\-_].*)/;

async function resolveAsyncModule(filepath: string, ctx: ILessLoaderContext) {
  const { loaderContextId, childHandler } = ctx;

  const resolvedModule = await childHandler.callFn({
    method: 'resolve-async-transpiled-module',
    data: {
      path: filepath,
      options: {
        ignoredExtensions: ['.less', '.css'],
      },
      loaderContextId,
    },
  });

  if (!resolvedModule.found) {
    throw new Error(`Module ${filepath} not found.`);
  }

  return resolvedModule;
}

/* eslint-disable no-unused-vars */
/* eslint-disable func-names */
export default function (ctx: ILessLoaderContext) {
  return {
    install(less, pluginManager) {
      function CSBFileManager() {}

      CSBFileManager.prototype = new less.FileManager();
      CSBFileManager.prototype.constructor = CSBFileManager;
      CSBFileManager.prototype.supports = function (filename) {
        return true;
      };

      CSBFileManager.prototype.loadFile = async function (
        importName,
        dirname,
        ...args
      ) {
        // eslint-disable-next-line no-param-reassign
        importName = importName.replace('file://', '');
        // eslint-disable-next-line no-param-reassign
        dirname = dirname || '/';

        let filepath: string = importName;
        if (importName[0] !== '/') {
          filepath = path.join(dirname, importName);
        }

        let contents = ctx.files[filepath];
        if (contents == null) {
          try {
            if (importName[0] === '~') {
              throw new Error('Skip resolution, it is a node_module');
            }

            const resolvedModule = await resolveAsyncModule(filepath, ctx);
            contents = resolvedModule.code;
            ctx.files[filepath] = contents;
          } catch (err) {
            const matches = importName.match(PKG_IMPORT_RE);
            if (matches && matches[1]) {
              return this.loadFile(
                `/node_modules/${matches[1]}`,
                dirname,
                ...args
              );
            }
          }
        }

        ctx.addDependency(filepath);

        return {
          contents,
          filename: filepath,
        };
      };

      pluginManager.addFileManager(new CSBFileManager());
    },
  };
}
