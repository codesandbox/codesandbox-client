import { orderBy } from 'lodash-es';
import { IEditorProxy, ISandboxProxy } from '../common/proxies';
import {
  CodeLocation,
  Fiber,
  StaticComponentInformation,
} from '../common/fibers';
import { Emitter } from '../common/rpc/event';
import { ReactEditorBridge } from '../common/react/editor';
import { IEditorInterface, IModel } from './editor-api';
import { Disposable, IDisposable } from '../common/rpc/disposable';
import {
  containsRange,
  isSameStart,
  stringifyCodeRange,
} from '../common/utils/code-location';
import { ComponentInstanceModel, IComponentInstanceModel } from './instance';

export class EditorInspectorState extends Disposable implements IEditorProxy {
  private fibers = new Map<string, Fiber>();
  private instances = new Map<string, ComponentInstanceModel[]>();
  private selectedInstance: ComponentInstanceModel | null = null;

  private selectionChangedEmitter = new Emitter<ComponentInstanceModel | null>();
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

        this.bridge.modelRemoved(resource.path);
      })
    );

    this.initializeEditor();
    this.toDispose.push(
      editorApi.onDidActiveEditorChange(() => {
        this.initializeEditor();
      })
    );
  }

  cursorDisposable: IDisposable | null = null;
  private initializeEditor() {
    const activeEditor = this.editorApi.getActiveEditor();
    if (!activeEditor) {
      return;
    }

    // TODO: handle active editor changes and cases where model doesn't exist
    this.cursorDisposable = activeEditor.onDidChangeCursorPosition(event => {
      const model = activeEditor.getModel();
      if (!model) {
        return;
      }

      try {
        this.selectComponentInstance({
          path: model.getResource().path,
          codePosition: {
            startLineNumber: event.position.lineNumber,
            endLineNumber: event.position.lineNumber,
            startColumnNumber: event.position.columnNumber,
            endColumnNumber: event.position.columnNumber,
          },
        });
      } catch (e) {
        /* That's okay */
      }
    });
  }

  private async initializeModel(model: IModel) {
    const resource = model.getResource();
    // TODO(@CompuIves): handle scheme
    this.openedModels.set(resource.path, model);

    this.toDispose.push(
      model.onWillDispose(() => {
        const instances = this.instances.get(resource.path);
        if (instances) {
          instances.forEach(val => val.dispose());
        }
        this.instances.delete(resource.path);
      })
    );

    this.bridge.modelChanged(
      resource.path,
      model.getValue(),
      model.getVersionId()
    );
    await this.getComponentInstances(resource.path, model);

    this.toDispose.push(
      model.onDidChangeContent(() => {
        this.bridge.modelChanged(
          resource.path,
          model.getValue(),
          model.getVersionId()
        );
        this.getComponentInstances(resource.path, model);
      })
    );
  }

  $fiberChanged(id: string, fiber: Fiber) {
    console.log('Getting Fiber Changed');
    console.log(id, fiber);
  }

  $openFiber(id: string) {
    const foundFiber = this.fibers.get(id);
    if (!foundFiber) {
      throw new Error('Cannot find Fiber with id: ' + id);
    }

    const location = foundFiber.location;

    this.selectComponentInstance(location);
  }

  public getSelectedInstance() {
    return this.selectedInstance;
  }

  public async selectFiber(id: string) {
    const foundFiber = this.fibers.get(id);
    if (!foundFiber) {
      throw new Error('Cannot find Fiber with id: ' + id);
    }

    const location = foundFiber.location;
    let instances = this.instances.get(location.path);
    const model = await this.editorApi.openModel({
      scheme: 'file',
      path: location.path,
    });
    if (!instances) {
      await this.initializeModel(model);
    }

    instances = this.instances.get(location.path);

    const instance = this.selectComponentInstance(location);
    await this.editorApi.setSelectionOnActiveEditor(
      instance.getInstanceInformation().location.codePosition
    );
  }

  public selectComponentInstance(
    location: CodeLocation
  ): IComponentInstanceModel {
    const instances = this.instances.get(location.path);
    if (!instances) {
      throw new Error(`Cannot find component instances in '${location.path}'`);
    }

    const componentInstance = instances.find(i =>
      containsRange(
        i.getInstanceInformation().location.codePosition,
        location.codePosition
      )
    );
    if (!componentInstance) {
      throw new Error(
        `Cannot find a component instance at ${stringifyCodeRange(
          location.codePosition
        )}`
      );
    }

    if (componentInstance === this.selectedInstance) {
      return this.selectedInstance;
    }

    this.selectedInstance = componentInstance;
    this.selectionChangedEmitter.fire(componentInstance);

    return componentInstance;
  }

  public getFiberFromInstance(instance: IComponentInstanceModel): Fiber | null {
    const location = instance.getInstanceInformation().location;
    for (const [_key, fiber] of this.fibers) {
      if (isSameStart(fiber.location.codePosition, location.codePosition)) {
        return fiber;
      }
    }

    return null;
  }

  public async getComponentInformation(
    relativePath: string,
    fromPath: string,
    exportName: string
  ): Promise<StaticComponentInformation | undefined> {
    return this.bridge.getComponentInformation(
      relativePath,
      fromPath,
      exportName
    );
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

  private async getComponentInstances(
    path: string,
    model: IModel
  ): Promise<any> {
    const result = await this.bridge.getComponentInstanceInformation(path);
    const { instances, version } = result;

    if (model.getVersionId() !== version) {
      return;
    }
    if (model.isDisposed) {
      return;
    }

    const existingInstances = this.instances.get(path);

    if (existingInstances) {
      const orderChanged =
        existingInstances.length !== instances.length ||
        existingInstances.some(
          (inst, i) =>
            !instances[i] ||
            instances[i].name !== inst.getInstanceInformation().name
        );
      if (orderChanged) {
        // If order changes we're going to reinitialize everything and do a best effort of getting
        // our last selection back
        const currentSelection = this.selectedInstance;
        existingInstances.forEach(instance => {
          instance.dispose();
        });

        this.instances.set(
          path,
          instances.map(
            instance =>
              new ComponentInstanceModel(
                instance,
                model,
                this.sandboxProxy,
                this.editorApi,
                this
              )
          )
        );

        if (currentSelection) {
          const similarReference = this.instances
            .get(path)!
            .find(
              instance =>
                isSameStart(
                  instance.codePosition,
                  currentSelection.codePosition
                ) && instance.getName() === currentSelection.getName()
            );

          this.selectedInstance = similarReference || null;
          this.selectionChangedEmitter.fire(this.selectedInstance);
        }
      } else {
        instances.forEach((inst, i) => {
          existingInstances[i].updateModel(inst);
        });
      }
    } else {
      this.instances.set(
        path,
        instances.map(
          instance =>
            new ComponentInstanceModel(
              instance,
              model,
              this.sandboxProxy,
              this.editorApi,
              this
            )
        )
      );
    }
    return instances;
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
