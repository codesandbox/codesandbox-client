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
import { getAbsoluteDependencies } from '@codesandbox/common/lib/utils/dependencies';
import { getGlobal } from '@codesandbox/common/lib/utils/global';
import { protocolAndHost } from '@codesandbox/common/lib/utils/url-generator';
import { json } from 'overmind';
import { mkdir, rename, rmdir, unlink, writeFile } from './utils';
import { WAIT_INITIAL_TYPINGS_MS } from '../constants';

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
  private types: any = {};
  private deps: { [path: string]: string } = {};
  private isDisposed = false;
  private currentSyncId = 0;
  private typesInfo: Promise<any>;
  constructor(options: SandboxFsSyncOptions) {
    this.options = options;
    self.addEventListener('message', this.onWorkerMessage);
  }

  public getTypes() {
    return this.types;
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

      const syncDetails = await this.getDependencyTypingsSyncDetails();

      if (syncDetails) {
        this.fetchDependencyTypings(
          syncId,
          syncDetails.packageJsonContent,
          syncDetails.autoInstall
        );
      }
    } catch (error) {
      // eslint-disable-next-line
      console.error(error);
    }
  }

  private async getDependencyTypingsSyncDetails(): Promise<{
    packageJsonContent: string;
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
                    // If tsconfig exists we want to sync the types
                    resolve({
                      packageJsonContent: rv.toString(),
                      autoInstall: Boolean(tsConfigError) || !result,
                    });
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
    this.send('types-sync', this.types);
  }

  private sendType(type: { [path: string]: any }) {
    this.send('type-sync', type);
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

  private async fetchDependencyTypings(
    syncId: number,
    packageJSON: string,
    autoInstallTypes: boolean
  ) {
    try {
      const { dependencies = {}, devDependencies = {} } = JSON.parse(
        packageJSON
      );

      const totalDependencies = {
        '@types/jest': 'latest',
        ...dependencies,
        ...devDependencies,
      };

      if (autoInstallTypes) {
        const typeInfo = await this.getTypesInfo();
        Object.keys(totalDependencies).forEach(async dep => {
          if (
            !dep.startsWith('@types/') &&
            !totalDependencies[`@types/${dep}`] &&
            typeInfo[dep]
          ) {
            totalDependencies[`@types/${dep}`] = typeInfo[dep].latest;
          }
        });
      }

      const absoluteDependencies = await getAbsoluteDependencies(
        totalDependencies
      );

      Object.keys(absoluteDependencies).forEach(async depName => {
        const depVersion = absoluteDependencies[depName];

        try {
          const fetchRequest = await fetch(
            `${SERVICE_URL}/${depName}@${depVersion}.json`
          );

          if (!fetchRequest.ok) {
            throw new Error('Fetch error');
          }

          const { files } = await fetchRequest.json();

          if (!this.isDisposed && this.currentSyncId === syncId) {
            Object.assign(this.types, files);
            this.sendType(files);
          }
        } catch (e) {
          if (process.env.NODE_ENV === 'development') {
            console.warn('Trouble fetching types for ' + depName);
          }
        }
      });
    } catch (e) {
      /* ignore */
    }
  }
}

export default SandboxFsSync;
