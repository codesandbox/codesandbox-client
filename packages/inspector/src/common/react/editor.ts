import { RPCProtocolImpl } from '../rpc';
import { MainWorkerConnection } from '../rpc/connection';
// @ts-expect-error This is a worker
import WorkerAnalyzer from './analyze/worker/typescript-analyzer.worker';
import {
  Analyzer,
  analyzerProxyIdentifier,
  GetComponentInstancesResponse,
} from './analyze/proxies';

import { Disposable } from '../rpc/disposable';
import { StaticComponentInformation } from '../fibers';

export class ReactEditorBridge extends Disposable {
  private analyzerProxy: Analyzer;

  constructor() {
    super();
    // Analyze a typescript parser in a worker
    const workerFactory = () => new WorkerAnalyzer();
    const analyzerRpcProtocol = new RPCProtocolImpl(
      new MainWorkerConnection(workerFactory)
    );

    this.analyzerProxy = analyzerRpcProtocol.getProxy(analyzerProxyIdentifier);
  }

  public modelChanged(path: string, code: string, version: number) {
    return this.analyzerProxy.$fileChanged(path, code, version);
  }

  public modelRemoved(path: string) {
    return this.analyzerProxy.$fileDeleted(path);
  }

  public async getComponentInstanceInformation(
    path: string
  ): Promise<GetComponentInstancesResponse> {
    return this.analyzerProxy.$getComponentInstances(path);
  }

  public async getComponentInformation(
    relativePath: string,
    fromPath: string,
    exportName: string
  ): Promise<StaticComponentInformation | undefined> {
    return this.analyzerProxy.$getComponentInfo(
      relativePath,
      fromPath,
      exportName
    );
  }
}
