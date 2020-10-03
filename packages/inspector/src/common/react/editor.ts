// @ts-expect-error This is a worker
import WorkerAnalyzer from './analyze/typescript-analyzer.worker';

import { File } from '@babel/types';
import { CodeRange, FiberSourceInformation } from '../../common/fibers';
import { RPCProtocolImpl } from '../rpc';
import { MainWorkerConnection } from '../rpc/connection';
// @ts-expect-error This is a worker
import WorkerAnalyzer from './analyze/typescript-analyzer.worker';
import { Analyzer, analyzerProxyIdentifier } from './analyze/proxies';

export class ReactEditorBridge {
  private asts = new Map<string, File>();
  private analyzerProxy: Analyzer;

  constructor() {
    // Analyze a typescript parser in a worker
    const workerFactory = () => new WorkerAnalyzer();
    const analyzerRpcProtocol = new RPCProtocolImpl(
      new MainWorkerConnection(workerFactory)
    );

    this.analyzerProxy = analyzerRpcProtocol.getProxy(analyzerProxyIdentifier);
  }

  public async analyzeComponentLocations(path: string, code: string) {
    return this.analyzerProxy.$analyze({
      path,
      code,
      version: 0,
    });
  }

  public async getComponentInstanceInformation(
    path: string,
    code: string,
    codeRange: CodeRange
  ): Promise<FiberSourceInformation> {
    await this.analyzerProxy.$analyze({
      path,
      code,
      version: 0,
    });

    return this.analyzerProxy.$getProps(path, codeRange);
  }
}
