/// <reference lib="webworker" />
import ts from 'typescript';
import { CodeRange, FiberSourceInformation } from '../../fibers';
import { RPCProtocolImpl } from '../../rpc';
import { WorkerConnection } from '../../rpc/worker/connection';
import { analyzeProps } from './component-instance';
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

  async $getProps(
    path: string,
    range: CodeRange
  ): Promise<FiberSourceInformation> {
    const ast = this.fileMap.get(path);
    if (!ast) {
      throw new Error(`Can't find file with path: '${path}'`);
    }

    return analyzeProps(ast, range);
  }
}

const rpcProtocol = new RPCProtocolImpl(new WorkerConnection());
rpcProtocol.set(analyzerProxyIdentifier, new TypeScriptAnalyzer());
