/// <reference lib="webworker" />
import ts from 'typescript';
import { ComponentInstanceData } from '../../fibers';
import { RPCProtocolImpl } from '../../rpc';
import { WorkerConnection } from '../../rpc/worker/connection';
import { analyzeComponentInstances } from './component-instance';
import { Analyzer, AnalyzeRequest, analyzerProxyIdentifier } from './proxies';

class TypeScriptAnalyzer implements Analyzer {
  fileMap = new Map<string, ts.SourceFile>();

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

    this.fileMap.set(path, sourceFile);
  }

  async $getComponentInstances(path: string): Promise<ComponentInstanceData[]> {
    const ast = this.fileMap.get(path);
    if (!ast) {
      throw new Error(`Can't find file with path: '${path}'`);
    }

    return analyzeComponentInstances(ast, path);
  }
}

const rpcProtocol = new RPCProtocolImpl(new WorkerConnection());
rpcProtocol.set(analyzerProxyIdentifier, new TypeScriptAnalyzer());
