// @ts-expect-error This is a worker
import WorkerAnalyzer from './analyze/typescript-analyzer.worker';

import { ComponentInstanceData } from '../../common/fibers';
import { RPCProtocolImpl } from '../rpc';
import { MainWorkerConnection } from '../rpc/connection';
// @ts-expect-error This is a worker
import WorkerAnalyzer from './analyze/typescript-analyzer.worker';
import { Analyzer, analyzerProxyIdentifier } from './analyze/proxies';

export class ReactEditorBridge {
  private analyzerProxy: Analyzer;

  constructor() {
    // Analyze a typescript parser in a worker
    const workerFactory = () => new WorkerAnalyzer();
    const analyzerRpcProtocol = new RPCProtocolImpl(
      new MainWorkerConnection(workerFactory)
    );

    this.analyzerProxy = analyzerRpcProtocol.getProxy(analyzerProxyIdentifier);
  }

  public async analyzeComponentLocations(
    path: string,
    code: string,
    version: number
  ) {
    return this.analyzerProxy.$analyze({
      path,
      code,
      version,
    });
  }

  public async getComponentInstanceInformation(
    path: string
  ): Promise<ComponentInstanceData[]> {
    return this.analyzerProxy.$getComponentInstances(path);
  }
}
