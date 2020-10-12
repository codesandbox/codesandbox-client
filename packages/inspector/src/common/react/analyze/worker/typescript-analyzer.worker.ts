/// <reference lib="webworker" />
import ts from 'typescript';
import { RPCProtocolImpl } from '../../../rpc';
import { WorkerConnection } from '../../../rpc/worker/connection';
import { analyzeComponentInstances } from './component-instance';
import {
  Analyzer,
  analyzerProxyIdentifier,
  GetComponentInstancesResponse,
} from '../proxies';
import { StaticComponentInformation } from '../../../fibers';
import { analyzeComponent } from './component';

type FileInfo = {
  version: number;
  snapshot: ts.IScriptSnapshot;
};

self.importScripts(
  `${process.env.CODESANDBOX_HOST}/static/browserfs12/browserfs.min.js`
);

class TypeScriptAnalyzer implements Analyzer {
  private fileMap = new Map<string, FileInfo>();
  private host: ts.LanguageServiceHost;
  private sys: ts.System;
  private service: ts.LanguageService;
  private documentRegistry = ts.createDocumentRegistry();

  constructor() {
    this.sys = require('./system').createSystem();
    this.host = this.createHost();
    this.service = ts.createLanguageService(this.host, this.documentRegistry);

    // @ts-expect-error Debugging purposes
    self.analyzer = this;
  }

  $fileChanged(path: string, code: string, version: number) {
    const snapshot = ts.ScriptSnapshot.fromString(code);
    this.fileMap.set(path, {
      snapshot,
      version,
    });

    this.documentRegistry.updateDocument(
      path,
      this.getCompilationSettings(),
      snapshot,
      String(version)
    );
  }

  $fileDeleted(path: string) {
    this.fileMap.delete(path);
    this.documentRegistry.releaseDocument(path, this.getCompilationSettings());
  }

  async $getComponentInstances(
    path: string
  ): Promise<GetComponentInstancesResponse> {
    const file = this.fileMap.get(path);
    const program = this.service.getProgram();
    if (!program) {
      throw new Error('Program not initialized');
    }

    const sourceFile = program.getSourceFile(path);

    if (!sourceFile) {
      throw new Error(`Can't find file with path: '${path}'`);
    }

    return {
      version: file?.version || 0,
      instances: analyzeComponentInstances(sourceFile, path),
    };
  }

  async $getComponentInfo(
    relativePath: string,
    fromPath: string,
    exportName: string
  ): Promise<StaticComponentInformation | undefined> {
    const program = this.service.getProgram();
    if (!program) {
      throw new Error('Program not initialized');
    }

    const lookupResult = ts.resolveModuleName(
      relativePath,
      fromPath,
      this.getCompilationSettings(),
      this.sys
    );

    if (!lookupResult.resolvedModule) {
      throw new Error(`Could not find '${relativePath}' from '${fromPath}'`);
    }

    const sourceFile = program.getSourceFile(
      lookupResult.resolvedModule.resolvedFileName
    );

    if (!sourceFile) {
      throw new Error(
        `Can't find file with path: '${lookupResult.resolvedModule.resolvedFileName}'`
      );
    }

    return analyzeComponent(sourceFile, exportName, program.getTypeChecker()!);
  }

  private getCompilationSettings = (): ts.CompilerOptions => {
    const tsConfig = ts.readConfigFile(
      '/sandbox/tsconfig.json',
      this.sys.readFile
    );
    if (tsConfig.config) {
      return tsConfig.config;
    }

    return ts.getDefaultCompilerOptions();
  };

  private createHost(): ts.LanguageServiceHost {
    return {
      getCompilationSettings: this.getCompilationSettings,
      getScriptFileNames: () => [...this.fileMap.keys()],
      getScriptVersion: (fileName: string) => {
        const version = this.fileMap.get(fileName)?.version;
        if (version) {
          return String(version);
        }
        return '0';
      },
      getScriptSnapshot: (fileName: string) => {
        const file = this.fileMap.get(fileName);
        if (file) {
          return file.snapshot;
        }

        const fileFromFS = this.sys.readFile(fileName);
        if (fileFromFS) {
          return ts.ScriptSnapshot.fromString(fileFromFS);
        }

        return undefined;
      },
      getDefaultLibFileName: options => {
        return ts.combinePaths(
          ts.getDirectoryPath(
            ts.normalizePath(this.sys.getExecutingFilePath())
          ),
          ts.getDefaultLibFileName(options)
        );
      },
      getCurrentDirectory: this.sys.getCurrentDirectory,
      fileExists: this.sys.fileExists,
      readFile: this.sys.readFile,
      readDirectory: this.sys.readDirectory,
      directoryExists: this.sys.directoryExists,
      getDirectories: this.sys.getDirectories,
    };
  }
}

const rpcProtocol = new RPCProtocolImpl(new WorkerConnection());

/**
 * This is extremely dirty to get the file system in this worker. We should move
 * away from this as soon as possible
 */
function initializeFS() {
  return require('./fs.sync.dirty').initializeBrowserFS({
    syncSandbox: true,
    syncTypes: true,
  });
}
initializeFS().then(() => {
  console.log(BrowserFS.BFSRequire('fs').readdirSync('/sandbox'));
  rpcProtocol.set(analyzerProxyIdentifier, new TypeScriptAnalyzer());
});
