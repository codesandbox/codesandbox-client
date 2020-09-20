import {
  IEditorProxy,
  ISandboxProxy,
  rpcProtocol,
  editorProxyIdentifier,
  sandboxProxyIdentifier,
} from '../common/proxies';
import { Fiber, Prop } from '../common/fibers';
import * as ReactInspectorBridge from './react';
import { ComponentInformationResolver } from './component-information';
import { Disposable } from '../common/rpc/disposable';

type ResolverResult = {
  resolvedPath: string;
  code: string;
};
export interface Resolver {
  resolve(fromPath: string, toPath: string): Promise<ResolverResult>;
}

class Inspector extends Disposable implements ISandboxProxy {
  fibers = new Map<string, Fiber>();
  componentInfoResolver: ComponentInformationResolver;

  constructor(private editorProxy: IEditorProxy, private resolver: Resolver) {
    super();
    // @ts-ignore
    window['fire'] = () => {
      console.log(ReactInspectorBridge.getFibers());
    };

    this.componentInfoResolver = new ComponentInformationResolver(
      this.resolver
    );
    this.toDispose.push(this.componentInfoResolver);
  }

  async $getFiberProps(id: string): Promise<Prop[]> {
    const fiber = this.fibers.get(id);
    if (!fiber) {
      throw new Error('Could not find fiber with id: ' + id);
    }
    return [];
  }

  $highlightFiber(id: string): void {
    console.log('Got HighlightFiber', id);
  }

  async $getFibers(id?: string): Promise<Fiber[] | undefined> {
    const fibers = ReactInspectorBridge.getFibers();
    return fibers;
  }
}

let inspectorStateService: Inspector | undefined;

export function getInspectorStateService(resolver: Resolver) {
  if (!inspectorStateService) {
    const editorProxy = rpcProtocol.getProxy(editorProxyIdentifier);
    inspectorStateService = new Inspector(editorProxy, resolver);
    rpcProtocol.set(sandboxProxyIdentifier, inspectorStateService);
  }

  return inspectorStateService;
}
