import { orderBy } from 'lodash-es';
import { IEditorProxy, ISandboxProxy } from '../common/proxies';
import {
  Fiber,
  FiberSourceInformation,
  StaticComponentInformation,
} from '../common/fibers';
import { Emitter } from '../common/rpc/event';
import { ReactEditorBridge } from '../common/react/editor';
import { IEditorInterface, IModel } from './editor-api';
import { Disposable } from '../common/rpc/disposable';

export class EditorInspectorState extends Disposable implements IEditorProxy {
  private fibers = new Map<string, Fiber>();
  private selectedFiber: Fiber | null = null;

  private selectionChangedEmitter = new Emitter<Fiber>();
  public onSelectionChanged = this.selectionChangedEmitter.event;

  private fiberChangedEmitter = new Emitter<Fiber>();
  public onFiberChanged = this.fiberChangedEmitter.event;

  private bridge: ReactEditorBridge = new ReactEditorBridge();

  private openedModels = new Map<string, IModel>();

  constructor(
    private sandboxProxy: ISandboxProxy,
    private editorApi: IEditorInterface
  ) {
    super();
    // @ts-expect-error
    window.eInspector = this;

    this.editorApi.getModels().forEach(model => {
      this.initializeModel(model);
    });

    this.toDispose.push(
      this.editorApi.onModelAdded(({ model }) => {
        this.initializeModel(model);
      })
    );

    this.toDispose.push(
      this.editorApi.onModelRemoved(({ model }) => {
        const resource = model.getResource();
        // TODO(@CompuIves): handle scheme
        this.openedModels.delete(resource.path);
      })
    );
  }

  private initializeModel(model: IModel) {
    const resource = model.getResource();
    // TODO(@CompuIves): handle scheme
    this.openedModels.set(resource.path, model);

    this.toDispose.push(
      model.onDidChangeContent(() => {
        this.bridge.analyzeComponentLocations(
          model.getResource().path,
          model.getValue()
        );
      })
    );
  }

  private getFibersFromPath(path: string): Fiber[] {
    const fibers: Fiber[] = [];

    this.fibers.forEach(fiber => {
      if (fiber.location.path === path) {
        fibers.push(fiber);
      }
    });

    return fibers;
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

  public async getFiberPropSources(
    id: string,
    code: string
  ): Promise<FiberSourceInformation> {
    // Running it in the editor:
    const fiber = this.fibers.get(id);
    if (!fiber) {
      throw new Error('Could not find fiber with id: ' + id);
    }

    return this.bridge.getComponentInstanceInformation(
      fiber.location.path,
      code,
      fiber.location.codePosition
    );
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
