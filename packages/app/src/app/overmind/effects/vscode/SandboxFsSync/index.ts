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
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import delay from '@codesandbox/common/lib/utils/delay';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { getSavedCode } from 'app/overmind/utils/sandbox';
import { json } from 'overmind';

import { WAIT_INITIAL_TYPINGS_MS } from '../constants';
import { appendFile, mkdir, rename, rmdir, unlink, writeFile } from './utils';

const global = getGlobal() as Window & { BrowserFS: any };

const SERVICE_URL = 'https://ata.codesandbox.io/api/v8';
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

declare global {
  interface Window {
    BrowserFS: any;
  }
}

type SandboxFsSyncOptions = {
  getSandboxFs: () => SandboxFs;
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

  private onWorkerMessage = evt => {
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
  private async syncDependencyTypings(fsId?) {
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

    this.typesInfo = fetch('https://unpkg.com/types-registry@latest/index.json')
      .then(x => x.json())
      .then(x => x.entries);

    return this.typesInfo;
  }

  // We send new packages to all registered workers
  private setAndSendPackageTypes(
    name: string,
    types: { [name: string]: string }
  ) {
    if (!this.isDisposed) {
      if (!this.types[name]) {
        this.types[name] = {};
      }

      Object.assign(this.types[name], types);
      this.send('package-types-sync', types);
    }
  }

  private async fetchDependencyTyping(
    dep: { name: string; version: string },
    autoInstallTypes: boolean
  ) {
    try {
      if (
        autoInstallTypes &&
        this.typesInfo[dep.name] &&
        !dep.name.startsWith('@types/')
      ) {
        const name = `@types/${dep.name}`;
        this.fetchDependencyTypingFiles(name, this.typesInfo[dep.name].latest)
          .then(files => {
            this.setAndSendPackageTypes(dep.name, files);
          })
          .catch(e => {
            if (process.env.NODE_ENV === 'development') {
              console.warn('Trouble fetching types for ' + name);
            }
          });
      }

      try {
        const files = await this.fetchDependencyTypingFiles(
          dep.name,
          dep.version
        );

        this.setAndSendPackageTypes(dep.name, files);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Trouble fetching types for ' + dep.name);
        }
      }
    } catch (e) {
      /* ignore */
    }
  }

  private async fetchDependencyTypingFiles(name: string, version: string) {
    const dependencyQuery = encodeURIComponent(`${name}@${version}`);

    try {
      const url = `${BUCKET_URL}/${name}/${version}.json`;
      return await requestPackager(url, 0).then(x => x.files);
    } catch (e) {
      // Hasn't been generated
    }

    const { files } = await requestPackager(
      `${SERVICE_URL}/${dependencyQuery}.json`,
      3
    );

    return files;
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
