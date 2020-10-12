import { RPCProtocolImpl, createProxyIdentifier } from './rpc';
import { CodeSandboxAPIConnection } from './rpc/connection';
import { Fiber } from './fibers';

export interface ISandboxProxy {
  $highlightFiber(id: string): void;
  $stopHighlightFiber(id: string): void;
  $getFibers(id?: string): Promise<Fiber[] | undefined>;

  $setFiberProp(id: string, path: string[], value: any): Promise<void>;
}

export interface IEditorProxy {
  $fiberChanged(id: string, fiber: Fiber): void;
}

export const sandboxProxyIdentifier = createProxyIdentifier<ISandboxProxy>(
  'sandboxInspector'
);
export const editorProxyIdentifier = createProxyIdentifier<IEditorProxy>(
  'editorInspector'
);

export const rpcProtocol = new RPCProtocolImpl(new CodeSandboxAPIConnection());
