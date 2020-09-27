import { orderBy } from 'lodash-es';
import {
  IEditorProxy,
  ISandboxProxy,
  rpcProtocol,
  editorProxyIdentifier,
  sandboxProxyIdentifier,
} from '../common/proxies';
import { Fiber , StaticComponentInformation } from '../common/fibers';
import { Emitter } from '../common/rpc/event';



export class EditorInspectorState implements IEditorProxy {
  private fibers = new Map<string, Fiber>();

  private selectedFiber: Fiber | null = null;
  private selectionChangedEmitter = new Emitter<Fiber>();
  public onSelectionChanged = this.selectionChangedEmitter.event;

  private fiberChangedEmitter = new Emitter<Fiber>();
  public onFiberChanged = this.fiberChangedEmitter.event;

  constructor(private sandboxProxy: ISandboxProxy) {
    window.eInspector = this;
  }

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

  public async getFiberComponentInformation(
    id: string
  ): Promise<StaticComponentInformation> {
    const data = await this.sandboxProxy.$getFiberComponentInformation(id);
    return data;
  }

  public async getFibers(): Promise<Fiber[]> {
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

  public highlightFiber(id: string): void {
    this.sandboxProxy.$highlightFiber(id);
  }

  /**
   * Stops highlighting of that fiber
   * @param id We pass an ID to make sure that we're not "unhighlighting" fibers that are not there
   */
  public stopHighlightFiber(id: string): void {
    this.sandboxProxy.$stopHighlightFiber(id);
  }

  private buildFlatOrderedFiberList() {
    const fibersByParent = new Map<string | null, Fiber[]>();
    for (const fiber of this.fibers.values()) {
      const existingParent = fibersByParent.get(fiber.parentFiberId);
      if (!existingParent) {
        fibersByParent.set(fiber.parentFiberId, [fiber]);
      } else {
        existingParent.push(fiber);
      }
    }

    // TODO(@CompuIves)
    const orderedFibers: Fiber[] = [];

    const currentFiber = fibersByParent.get(null);

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
