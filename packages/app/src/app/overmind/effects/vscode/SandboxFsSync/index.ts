import { dirname } from 'path';

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
import {
  fetchPackageJSON,
  isAbsoluteVersion,
} from '@codesandbox/common/lib/utils/dependencies';
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { json } from 'overmind';

import { WAIT_INITIAL_TYPINGS_MS } from '../constants';
import { mkdir, rename, rmdir, unlink, writeFile } from './utils';

const global = getGlobal() as Window & { BrowserFS: any };

const browserFs = global.BrowserFS.BFSRequire('fs');
const SERVICE_URL = 'https://ata-fetcher.cloud/api/v5/typings';

let lastMTime = new Date(0);

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

  private deps: { [path: string]: string } = {
    '@types/jest': 'latest',
  };

  private isDisposed = false;
  private currentSyncId = 0;
  private typesInfo: Promise<any>;
  constructor(options: SandboxFsSyncOptions) {
    this.options = options;
    self.addEventListener('message', this.onWorkerMessage);
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
  }

  public create(sandbox: Sandbox): SandboxFs {
    const sandboxFs = {};

    sandbox.modules.forEach(m => {
      const path = getModulePath(sandbox.modules, sandbox.directories, m.id);
      if (path) {
        m.path = path;
        sandboxFs[path] = {
          ...m,
          type: 'file',
        };
      }
    });

    sandbox.directories.forEach(d => {
      const path = getDirectoryPath(sandbox.modules, sandbox.directories, d.id);

      d.path = path;
      // If this is a single directory with no children
      if (!Object.keys(sandboxFs).some(p => dirname(p) === path)) {
        sandboxFs[path] = { ...d, type: 'directory' };
      }
    });

    this.syncSandbox(sandboxFs);

    return sandboxFs;
  }

  public writeFile(fs: SandboxFs, module: Module) {
    const copy = json(module);

    writeFile(fs, copy);
    this.send('write-file', copy);

    if (module.title === 'package.json') {
      this.syncDependencyTypings(this.currentSyncId + 1);
    }
  }

  public rename(fs: SandboxFs, fromPath: string, toPath: string) {
    rename(fs, fromPath, toPath);
    this.send('rename', {
      fromPath,
      toPath,
    });
  }

  public rmdir(fs: SandboxFs, directory: Directory) {
    const copy = json(directory);

    rmdir(fs, copy);
    this.send('rmdir', copy);
  }

  public unlink(fs: SandboxFs, module: Module) {
    const copy = json(module);

    unlink(fs, copy);
    this.send('unlink', copy);
  }

  public mkdir(fs: SandboxFs, directory: Directory) {
    const copy = json(directory);

    mkdir(fs, copy);
    this.send('mkdir', copy);
  }

  public async syncTypings(cb: () => void) {
    try {
      await this.syncDependencyTypings(this.currentSyncId + 1);
    } catch (error) {
      // Do nothing
    }

    setTimeout(() => {
      if (!this.isDisposed) {
        cb();
      }
    }, WAIT_INITIAL_TYPINGS_MS);
  }

  private onWorkerMessage = evt => {
    if (evt.data.$type === 'sync-types') {
      // We pass the current syncId as we want to latch on
      // to the existing sync
      this.syncDependencyTypings(this.currentSyncId);
    }

    if (evt.data.$type === 'sync-sandbox') {
      this.syncSandbox(this.options.getSandboxFs());
    }
  };

  // We sync the FS whenever we create a new one, which happens in different
  // scenarios. If a worker is requesting a sync we grab the existing FS from
  // the state
  private syncSandbox(sandboxFs) {
    this.send('sandbox-fs', json(sandboxFs));
  }

  private send(type: string, data: any) {
    global.postMessage(
      {
        $broadcast: true,
        $type: type,
        $data: data,
      },
      protocolAndHost()
    );
  }

  // We pass in either existing or new syncId. This allows us to evaluate
  // if we are just going to pass existing types or start up a new round
  // to fetch types
  private async syncDependencyTypings(syncId: number) {
    if (syncId === this.currentSyncId) {
      this.sendTypes();
      return;
    }

    try {
      this.currentSyncId = syncId;

      this.typesInfo = await this.getTypesInfo();
      const syncDetails = await this.getDependencyTypingsSyncDetails();

      if (syncDetails) {
        const newDeps = syncDetails.dependencies;
        const { added, removed } = this.getDepsChanges(newDeps);

        this.deps = newDeps;

        added.forEach(dep => {
          this.fetchDependencyTyping(syncId, dep, syncDetails.autoInstall);
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

          this.send('types-remove', removedTypings);
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
  }> {
    return new Promise((resolve, reject) => {
      try {
        browserFs.stat('/sandbox/package.json', (packageJsonError, stat) => {
          if (packageJsonError) {
            reject(packageJsonError);
            return;
          }

          if (stat.mtime.toString() !== lastMTime.toString()) {
            lastMTime = stat.mtime;

            browserFs.readFile(
              '/sandbox/package.json',
              async (packageJsonReadError, rv) => {
                if (packageJsonReadError) {
                  reject(packageJsonReadError);
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
                      reject(
                        new Error('TYPINGS: Could not parse package.json')
                      );
                    }
                  }
                );
              }
            );
          } else {
            resolve(null);
          }
        });
      } catch (e) {
        resolve(null);
        // Do nothing
      }
    });
  }

  private sendTypes() {
    this.send('types-sync', this.getTypes());
  }

  private sendPackageTypes(types: { [path: string]: any }) {
    this.send('package-types-sync', types);
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

  private setAndSendPackageTypes(
    name: string,
    types: { [name: string]: string },
    syncId: number
  ) {
    if (!this.isDisposed && this.currentSyncId === syncId) {
      if (!this.types[name]) {
        this.types[name] = {};
      }

      Object.assign(this.types[name], types);
      this.sendPackageTypes(types);
    }
  }

  private async fetchDependencyTyping(
    syncId: number,
    dep: { name: string; version: string },
    autoInstallTypes: boolean
  ) {
    try {
      if (
        autoInstallTypes &&
        this.typesInfo[dep.name] &&
        !dep.name.startsWith('@types/') &&
        isAbsoluteVersion(dep.version)
      ) {
        const name = `@types/${dep.name}`;
        fetchPackageJSON(name, dep.version).then(({ version }) => {
          this.setAndSendPackageTypes(
            dep.name,
            {
              [name]: version,
            },
            syncId
          );
        });
      }

      try {
        const fetchRequest = await fetch(
          `${SERVICE_URL}/${dep.name}@${dep.version}.json`
        );

        if (!fetchRequest.ok) {
          throw new Error('Fetch error');
        }

        const { files } = await fetchRequest.json();

        this.setAndSendPackageTypes(dep.name, files, syncId);
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('Trouble fetching types for ' + dep.name);
        }
      }
    } catch (e) {
      /* ignore */
    }
  }
}

export default SandboxFsSync;
