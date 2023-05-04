import browserFs from 'fs';
import { dirname, join } from 'path';

import {
  getDirectoryPath,
  getModulePath,
} from '@codesandbox/common/lib/sandbox/modules';
import {
  Directory,
  Module,
  Sandbox,
  SandboxFs,
} from '@codesandbox/common/lib/types';
import delay from '@codesandbox/common/lib/utils/delay';
import { getAbsoluteDependency } from '@codesandbox/common/lib/utils/dependencies';
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { getSavedCode } from 'app/overmind/utils/sandbox';
import { isPrivateScope } from 'app/utils/private-registry';
import { json } from 'overmind';

import { WAIT_INITIAL_TYPINGS_MS } from '../constants';
import { appendFile, mkdir, rename, rmdir, unlink, writeFile } from './utils';
import { fetchPrivateDependency } from './private-type-fetch';

const global = getGlobal() as Window & { BrowserFS: any };

const SERVICE_URL = 'https://ata.codesandbox.io/api/v8';
const FALLBACK_SERVICE_URL = 'https://typings.csb.dev/api/v8';
const BUCKET_URL = 'https://prod-packager-packages.codesandbox.io/v1/typings';

async function callApi(url: string, method = 'GET') {
  const response = await fetch(url, {
    method,
  });

  if (!response.ok) {
    const error = new Error(response.statusText || '' + response.status);
    const message = await response.json();
    // @ts-ignore
    error.response = message;
    // @ts-ignore
    error.statusCode = response.status;
    throw error;
  }

  return response.json();
}

async function requestPackager(url: string, retryCount = 0, method = 'GET') {
  let retries = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    try {
      const manifest = await callApi(url, method); // eslint-disable-line no-await-in-loop

      return manifest;
    } catch (e) {
      if (e.response && e.statusCode !== 504) {
        throw new Error(e.response.error);
      }
      // 403 status code means the bundler is still bundling
      if (retries < retryCount) {
        retries += 1;
        await delay(1000 * 2); // eslint-disable-line no-await-in-loop
      } else {
        throw e;
      }
    }
  }
}

type SandboxFsSyncOptions = {
  getSandboxFs: () => SandboxFs;
  getCurrentSandbox: () => Sandbox | null;
};

class SandboxFsSync {
  private options: SandboxFsSyncOptions;
  private types: {
    [packageName: string]: {
      [typeName: string]: string;
    };
  } = {};

  private deps: { [path: string]: string } = {};

  private workerIds: string[] = [];

  private isDisposed = false;
  private typesInfo: Promise<any>;
  constructor(options: SandboxFsSyncOptions) {
    this.options = options;
    self.addEventListener('message', this.onWorkerMessage);
  }

  public sync(cb: () => void) {
    this.send('reset', {});
    this.syncDependencyTypings();
    setTimeout(() => {
      if (!this.isDisposed) {
        cb();
      }
    }, WAIT_INITIAL_TYPINGS_MS);
  }

  public getTypes() {
    return Object.keys(this.types).reduce(
      (aggr, key) => Object.assign(aggr, this.types[key]),
      {}
    );
  }

  public dispose() {
    this.isDisposed = true;
    self.removeEventListener('message', this.onWorkerMessage);
    this.clearSandboxFiles();
  }

  public create(sandbox: Sandbox): SandboxFs {
    const sandboxFs = {};

    sandbox.directories.forEach(d => {
      const path = getDirectoryPath(sandbox.modules, sandbox.directories, d.id);

      d.path = path;
      // If this is a single directory with no children
      if (!Object.keys(sandboxFs).some(p => dirname(p) === path)) {
        sandboxFs[path] = { ...d, type: 'directory' };
      }

      browserFs.mkdir(join('/sandbox', path), () => {});
    });

    sandbox.modules.forEach(m => {
      const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
      if (path) {
        m.path = path;
        sandboxFs[path] = {
          ...m,
          type: 'file',
        };

        browserFs.writeFile(join('/sandbox', path), m.code, () => {});
      }
    });

    return sandboxFs;
  }

  public appendFile(fs: SandboxFs, module: Module) {
    const copy = json(module);

    appendFile(fs, copy);
    this.send('append-file', copy);

    const savedCode = getSavedCode(module.code, module.savedCode);
    browserFs.appendFile(join('/sandbox', module.path!), savedCode, () => {});
  }

  public writeFile(fs: SandboxFs, module: Module) {
    const copy = json(module);

    writeFile(fs, copy);
    this.send('write-file', copy);

    const savedCode = getSavedCode(module.code, module.savedCode);
    browserFs.writeFile(join('/sandbox', module.path!), savedCode, () => {});

    if (module.title === 'package.json') {
      this.syncDependencyTypings();
    }
  }

  public rename(fs: SandboxFs, fromPath: string, toPath: string) {
    rename(fs, fromPath, toPath);
    this.send('rename', {
      fromPath,
      toPath,
    });
    browserFs.rename(
      join('/sandbox', fromPath),
      join('/sandbox', toPath),
      () => {}
    );
  }

  public rmdir(fs: SandboxFs, directory: Directory) {
    const copy = json(directory);

    rmdir(fs, copy);
    this.send('rmdir', copy);
    browserFs.rmdir(join('/sandbox', directory.path!), () => {});
  }

  public unlink(fs: SandboxFs, module: Module) {
    const copy = json(module);

    unlink(fs, copy);
    this.send('unlink', copy);
    browserFs.unlink(join('/sandbox', module.path!), () => {});
  }

  public mkdir(fs: SandboxFs, directory: Directory) {
    const copy = json(directory);

    mkdir(fs, copy);
    this.send('mkdir', copy);
    browserFs.mkdir(join('/sandbox', directory.path!), () => {});
  }

  private onWorkerMessage = (evt: MessageEvent<any>) => {
    if (evt.data.$fs_id && !this.workerIds.includes(evt.data.$fs_id)) {
      this.workerIds.push(evt.data.$fs_id);
    }

    if (evt.data.$type === 'sync-sandbox') {
      this.syncSandbox(this.options.getSandboxFs(), evt.data.$fs_id);
    }

    if (evt.data.$type === 'sync-types') {
      this.send('types-sync', this.getTypes(), evt.data.$fs_id);
    }
  };

  // We sync the FS whenever we create a new one, which happens in different
  // scenarios. If a worker is requesting a sync we grab the existing FS from
  // the state
  private syncSandbox(sandboxFs, id?) {
    this.send('sandbox-fs', json(sandboxFs), id);
  }

  private send(type: string, data: any, id?: string) {
    global.postMessage(
      {
        $broadcast: true,
        $fs_ids: typeof id === 'undefined' ? this.workerIds : [id],
        $type: type,
        $data: data,
      },
      protocolAndHost()
    );
  }

  // We pass in either existing or new syncId. This allows us to evaluate
  // if we are just going to pass existing types or start up a new round
  // to fetch types
  private async syncDependencyTypings(fsId?: string) {
    try {
      this.typesInfo = await this.getTypesInfo();
      const syncDetails = await this.getDependencyTypingsSyncDetails();

      if (syncDetails) {
        const newDeps = syncDetails.dependencies;
        const { added, removed } = this.getDepsChanges(newDeps);

        this.deps = newDeps;

        added.forEach(dep => {
          this.fetchDependencyTyping(dep, syncDetails.autoInstall);
        });

        if (removed.length) {
          const removedTypings = {};

          // We go through removed deps to figure out what typings packages
          // has been removed, then delete the from our types as well
          removed.forEach(removedDep => {
            const typings = this.types[removedDep.name] || {};

            Object.assign(removedTypings, typings);

            this.fetchedPrivateDependencies.delete(removedDep.name);

            delete this.types[removedDep.name];
          });

          this.send('types-remove', removedTypings, fsId);
        }
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }

  private getDepsChanges(newDeps) {
    const added: Array<{ name: string; version: string }> = [];
    const removed: Array<{ name: string; version: string }> = [];
    const newDepsKeys = Object.keys(newDeps);
    const currentDepsKeys = Object.keys(this.deps);

    if (currentDepsKeys.length === 0) {
      added.push({
        name: '@types/jest',
        version: 'latest',
      });
    }

    newDepsKeys.forEach(newDepKey => {
      if (
        !this.deps[newDepKey] ||
        this.deps[newDepKey] !== newDeps[newDepKey]
      ) {
        added.push({
          name: newDepKey,
          version: newDeps[newDepKey],
        });
      }
    });

    currentDepsKeys.forEach(currentDepKey => {
      if (currentDepKey !== '@types/jest' && !newDeps[currentDepKey]) {
        removed.push({
          name: currentDepKey,
          version: this.deps[currentDepKey],
        });
      }
    });

    return { added, removed };
  }

  private async getDependencyTypingsSyncDetails(): Promise<{
    dependencies: { [name: string]: string };
    autoInstall: boolean;
  } | null> {
    return new Promise((resolve, reject) => {
      try {
        browserFs.stat('/sandbox/package.json', (packageJsonError, stat) => {
          if (packageJsonError) {
            resolve(null);
            return;
          }

          browserFs.readFile(
            '/sandbox/package.json',
            async (packageJsonReadError, rv) => {
              if (packageJsonReadError) {
                resolve(null);
                return;
              }

              browserFs.stat(
                '/sandbox/tsconfig.json',
                (tsConfigError, result) => {
                  // If tsconfig exists we want to sync the typesp
                  try {
                    const packageJson = JSON.parse(rv.toString());
                    resolve({
                      dependencies: {
                        ...packageJson.dependencies,
                        ...packageJson.devDependencies,
                      },
                      autoInstall: Boolean(tsConfigError) || !result,
                    });
                  } catch (error) {
                    reject(new Error('TYPINGS: Could not parse package.json'));
                  }
                }
              );
            }
          );
        });
      } catch (e) {
        resolve(null);
        // Do nothing
      }
    });
  }

  /**
   * Gets all entries of dependencies -> @types/ version
   */
  private getTypesInfo() {
    if (this.typesInfo) {
      return this.typesInfo;
    }

    this.typesInfo = fetch(
      'https://unpkg.com/types-registry@latest/index.json',
      // This falls back to etag caching, ensuring we always have latest version
      // https://hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
      { cache: 'no-cache' }
    )
      .then(x => x.json())
      .then(x => x.entries);

    return this.typesInfo;
  }

  // We send new packages to all registered workers
  private setAndSendPackageTypes(
    name: string,
    types: { [name: string]: { module: { code: string } } }
  ) {
    if (!this.isDisposed) {
      if (!this.types[name]) {
        this.types[name] = {};
      }

      const existingDeps = Object.keys(this.types);
      /*
        We have to ensure that a dependency does not override the types of the main
        package if it is installed (their versions might differ)
      */
      const filteredTypes = Object.keys(types).reduce((aggr, newTypePath) => {
        const alreadyExists = existingDeps.reduce((subAggr, depName) => {
          // If we have already installed the typing from the main package
          if (
            subAggr ||
            (depName !== name &&
              this.types[depName][newTypePath] &&
              newTypePath.startsWith('/' + depName + '/'))
          ) {
            return true;
          }

          return subAggr;
        }, false);

        if (!alreadyExists) {
          aggr[newTypePath] = types[newTypePath];
        }

        return aggr;
      }, {});

      Object.assign(this.types[name], filteredTypes);
      this.send('package-types-sync', filteredTypes);
    }
  }

  private async fetchDependencyTyping(
    dep: { name: string; version: string },
    autoInstallTypes: boolean
  ) {
    try {
      try {
        const files = await this.fetchDependencyTypingFiles(
          dep.name,
          dep.version
        );
        const hasTypes = Boolean(
          Object.keys(files).some(
            key => key.startsWith('/' + dep.name) && key.endsWith('.d.ts')
          )
        );

        if (
          !hasTypes &&
          autoInstallTypes &&
          this.typesInfo[dep.name] &&
          !dep.name.startsWith('@types/')
        ) {
          const name = `@types/${dep.name}`;
          this.fetchDependencyTypingFiles(name, this.typesInfo[dep.name].latest)
            .then(typesFiles => {
              this.setAndSendPackageTypes(dep.name, typesFiles);
            })
            .catch(e => {
              if (process.env.NODE_ENV === 'development') {
                console.warn('Trouble fetching types for ' + name);
              }
            });
        } else {
          this.setAndSendPackageTypes(dep.name, files);
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Trouble fetching types for ' + dep.name);
        }
      }
    } catch (e) {
      /* ignore */
    }
  }

  private fetchedPrivateDependencies = new Set<string>();
  /**
   * Fetch the dependency typings of a private package. We have different behaviour here,
   * instead of fetching directly from the type fetcher we fetch the tar directly, and
   * extract the `.d.ts` & `.ts` files from it. This doesn't account for all transient dependencies
   * of this dependency though, that's why we also download the "subdependencies" using the normal
   * fetching strategy (`fetchDependencyTypingFiles`).
   *
   * There's a risk we'll run in a deadlock in this approach; if `a` needs `b` and `b` needs `a`, we'll
   * recursively keep calling the same functions. To prevent this we keep track of which dependencies have
   * been processed and skip if those have been added already.
   */
  private async fetchPrivateDependencyTypingsFiles(
    name: string,
    version: string
  ): Promise<{ [f: string]: { module: { code: string } } }> {
    if (this.fetchedPrivateDependencies.has(name)) {
      return {};
    }

    const { dtsFiles, dependencies } = await fetchPrivateDependency(
      this.options.getCurrentSandbox()!,
      name,
      version
    );

    this.fetchedPrivateDependencies.add(name);

    const totalFiles: { [f: string]: { module: { code: string } } } = dtsFiles;
    dependencies.map(async dep => {
      const files = await this.fetchDependencyTypingFiles(
        dep.name,
        dep.version
      );
      Object.keys(files).forEach(f => {
        totalFiles[f] = files[f];
      });
    });

    return totalFiles;
  }

  private async fetchDependencyTypingFiles(
    originalName: string,
    originalVersion: string
  ): Promise<{ [path: string]: { module: { code: string } } }> {
    const sandbox = this.options.getCurrentSandbox();
    const isPrivatePackage = sandbox && isPrivateScope(sandbox, originalName);

    if (isPrivatePackage) {
      return this.fetchPrivateDependencyTypingsFiles(
        originalName,
        originalVersion
      );
    }

    const { name, version } = await getAbsoluteDependency(
      originalName,
      originalVersion
    );
    const dependencyQuery = encodeURIComponent(`${name}@${version}`);

    try {
      const url = `${BUCKET_URL}/${name}/${version}.json`;
      return await requestPackager(url, 0).then(x => x.files);
    } catch (e) {
      // Hasn't been generated
    }

    try {
      const { files } = await requestPackager(
        `${SERVICE_URL}/${dependencyQuery}.json`,
        3
      );

      return files;
    } catch {
      const { files } = await requestPackager(
        `${FALLBACK_SERVICE_URL}/${dependencyQuery}.json`,
        3
      );

      return files;
    }
  }

  private clearSandboxFiles(dir = '/sandbox') {
    if (dir === '/sandbox/node_modules') {
      return;
    }

    const kids = browserFs.readdirSync(dir);

    kids.forEach(kid => {
      const path = join(dir, kid);

      try {
        const lstat = browserFs.lstatSync(path);

        if (lstat.isDirectory()) {
          this.clearSandboxFiles(path);
        } else {
          browserFs.unlinkSync(path);
        }
      } catch {
        // Do nothing
      }
    });

    if (dir !== '/sandbox') {
      browserFs.rmdirSync(dir);
    }
  }
}

export default SandboxFsSync;
