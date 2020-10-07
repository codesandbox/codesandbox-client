/// <reference lib="webworker" />
import ts from 'typescript';
import { ComponentInstanceData } from '../../fibers';
import { RPCProtocolImpl } from '../../rpc';
import { WorkerConnection } from '../../rpc/worker/connection';
import { analyzeComponentInstances } from './component-instance';
import {
  Analyzer,
  AnalyzeRequest,
  analyzerProxyIdentifier,
  GetComponentInstancesResponse,
} from './proxies';

type FileInfo = {
  version: number;
  sourceFile: ts.SourceFile;
};

class TypeScriptAnalyzer implements Analyzer {
  fileMap = new Map<string, FileInfo>();

  $fileChanged(path: string, code: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
  $fileDeleted(path: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async $analyze({ code, version, path }: AnalyzeRequest): Promise<void> {
    const fileName = path.split('/').pop()!;
    const sourceFile = ts.createSourceFile(
      fileName,
      code,
      ts.ScriptTarget.Latest,
      true
    );

    this.fileMap.set(path, { version, sourceFile });
  }

  async $getComponentInstances(
    path: string
  ): Promise<GetComponentInstancesResponse> {
    const file = this.fileMap.get(path);
    if (!file) {
      throw new Error(`Can't find file with path: '${path}'`);
    }

    return {
      version: file.version,
      instances: analyzeComponentInstances(file.sourceFile, path),
    };
  }
}

const rpcProtocol = new RPCProtocolImpl(new WorkerConnection());
rpcProtocol.set(analyzerProxyIdentifier, new TypeScriptAnalyzer());
