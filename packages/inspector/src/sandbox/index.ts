import {
  IEditorProxy,
  ISandboxProxy,
  rpcProtocol,
  editorProxyIdentifier,
  sandboxProxyIdentifier,
} from '../common/proxies';
import { Fiber } from '../common/fibers';
import * as ReactInspectorBridge from '../common/react/sandbox';
import { Disposable } from '../common/rpc/disposable';
import { clearHighlight, highlightElement } from './highlight';

type ResolverResult = {
  resolvedPath: string;
  code: string;
};
export interface Resolver {
  resolve(fromPath: string, toPath: string): Promise<ResolverResult>;
}

class OverlayedResolver implements Resolver {
  constructor(
    private originalResolver: Resolver,
    private documents: Map<string, string>
  ) {}

  async resolve(fromPath: string, toPath: string): Promise<ResolverResult> {
    const result = await this.originalResolver.resolve(fromPath, toPath);

    const memDocument = this.documents.get(result.resolvedPath);
    if (memDocument !== undefined) {
      return {
        resolvedPath: result.resolvedPath,
        code: memDocument,
      };
    }

    return result;
  }
}

class Inspector extends Disposable implements ISandboxProxy {
  fibers = new Map<string, Fiber>();
  bridge: ReactInspectorBridge.ReactSandboxBridge;
  resolver: Resolver;

  documents = new Map<string, string>();

  constructor(private editorProxy: IEditorProxy, resolver: Resolver) {
    super();

    // @ts-expect-error
    window.inspector = this;

    this.bridge = new ReactInspectorBridge.ReactSandboxBridge();
    this.resolver = new OverlayedResolver(resolver, this.documents);

    this.toDispose.push(this.componentInfoResolver);
  }

  dispose() {
    super.dispose();
    this.documents.clear();
  }

  private lastHighlightedId: string | null = null;
  $highlightFiber(id: string): void {
    const element = this.bridge.getElementForFiber(id);
    this.lastHighlightedId = id;
    highlightElement(element);
  }

  $stopHighlightFiber(id: string): void {
    if (this.lastHighlightedId !== id) {
      return;
    }
    this.lastHighlightedId = null;
    clearHighlight();
  }

  async $getFibers(id?: string): Promise<Fiber[] | undefined> {
    const fibers = this.bridge.getFibers();
    fibers.forEach(fiber => {
      this.fibers.set(fiber.id, fiber);
    });
    return fibers;
  }

  async $setFiberProp(id: string, path: string[], value: any) {
    this.bridge.setFiberProp(id, path, value);
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
