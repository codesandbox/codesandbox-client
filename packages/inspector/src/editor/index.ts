import {
  IEditorProxy,
  ISandboxProxy,
  rpcProtocol,
  editorProxyIdentifier,
  sandboxProxyIdentifier,
} from 'inspector/lib/common/proxies';
import { Fiber } from 'inspector/lib/common/fibers';
import { Emitter } from 'inspector/lib/common/rpc/event';
import { orderBy } from 'lodash-es';

export class EditorInspectorState implements IEditorProxy {
  private fibers = new Map<string, Fiber>();

  private selectedFiber: Fiber | null = null;
  private selectionChangedEmitter = new Emitter<Fiber>();
  public onSelectionChanged = this.selectionChangedEmitter.event;

  private fiberChangedEmitter = new Emitter<Fiber>();
  public onFiberChanged = this.fiberChangedEmitter.event;

  constructor(private sandboxProxy: ISandboxProxy) {}

  $fiberChanged(id: string, fiber: Fiber) {
    console.log('Getting Fiber Changed');
    console.log(id, fiber);
  }

  $openFiber(id: string) {
    this.selectFiber(id);
  }

  public selectFiber(id: string) {
    const fiber = this.fibers.get(id);
    if (!fiber) {
      throw new Error(`Can't find fiber with id: ${id}`);
    }

    this.selectedFiber = fiber;
    this.selectionChangedEmitter.fire(fiber);
  }

  public async getFibers() {
    const fibers = await this.sandboxProxy.$getFibers();
    if (fibers) {
      fibers.forEach(fiber => {
        this.fibers.set(fiber.id, fiber);
        this.fiberChangedEmitter.fire(fiber);
      });

      return this.buildFlatOrderedFiberList();
    }

    return [];
  }

  highlightFiber(id: string): void {
    this.sandboxProxy.$highlightFiber(id);
  }

  private buildFlatOrderedFiberList() {
    let fibersByParent = new Map<string | null, Fiber[]>();
    for (let fiber of this.fibers.values()) {
      const existingParent = fibersByParent.get(fiber.parentFiberId);
      if (!existingParent) {
        fibersByParent.set(fiber.parentFiberId, [fiber]);
      } else {
        existingParent.push(fiber);
      }
    }

    // TODO(@CompuIves)
    const orderedFibers: Fiber[] = [];

    let currentFiber = fibersByParent.get(null);

    return orderBy([...this.fibers.values()], fiber => [
      fiber.depth,
      fiber.childIndex,
      fiber.parentFiberId,
    ]);
  }
}

let inspectorStateService: EditorInspectorState | undefined;

export function getInspectorStateService() {
  if (!inspectorStateService) {
    const sandboxProxy = rpcProtocol.getProxy(sandboxProxyIdentifier);
    inspectorStateService = new EditorInspectorState(sandboxProxy);
    rpcProtocol.set(editorProxyIdentifier, inspectorStateService);
  }

  return inspectorStateService;
}
