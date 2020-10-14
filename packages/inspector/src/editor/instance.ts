import { throwStatement } from '@babel/types';
import { EditorInspectorState } from '.';
import {
  CodeRange,
  ComponentInstanceData,
  SourcePropInfo,
  StaticComponentInformation,
} from '../common/fibers';
import { ISandboxProxy } from '../common/proxies';
import { Disposable, IDisposable } from '../common/rpc/disposable';
import { Emitter, Event } from '../common/rpc/event';
import { IEditorInterface, IModel } from './editor-api';
import {
  RangeStickinessBehaviour,
  SpanSubscription,
} from './span-subscription';
import { addProp, InitializerType } from './utils/code-manipulation';

export class InstanceProp extends Disposable {
  definitionPosition: CodeRange;
  namePosition: CodeRange;
  valuePosition: CodeRange | null;

  definitionSubscription: SpanSubscription;
  nameSubscription: SpanSubscription;
  valueSubscription: SpanSubscription | null;

  constructor(
    private model: IModel,
    private componentInstance: IComponentInstanceModel,
    private prop: SourcePropInfo
  ) {
    super();

    this.definitionPosition = prop.definitionPosition;
    this.namePosition = prop.namePosition;
    this.valuePosition = prop.valuePosition;

    this.definitionSubscription = new SpanSubscription(
      model,
      prop.definitionPosition
    );
    this.toDispose.push(this.definitionSubscription);
    this.toDispose.push(
      this.definitionSubscription.onDidRangeChange(event => {
        this.definitionPosition = event.range;
      })
    );

    this.nameSubscription = new SpanSubscription(model, prop.namePosition);
    this.toDispose.push(this.nameSubscription);
    this.toDispose.push(
      this.nameSubscription.onDidRangeChange(event => {
        this.namePosition = event.range;
      })
    );

    this.valueSubscription = null;
    if (prop.valuePosition) {
      this.valueSubscription = new SpanSubscription(model, prop.valuePosition);
      this.toDispose.push(this.valueSubscription);
      this.toDispose.push(
        this.valueSubscription.onDidRangeChange(event => {
          this.valuePosition = event.range;
        })
      );
    }
  }

  public getValue() {
    if (this.valueSubscription) {
      return this.valueSubscription.getContent();
    }
    return null;
  }

  public setFiberProp(value: any) {
    this.componentInstance.setFiberProp(this.prop.name, value);
  }

  public updateProp(prop: SourcePropInfo) {
    this.definitionPosition = prop.definitionPosition;
    this.namePosition = prop.namePosition;
    this.valuePosition = prop.valuePosition;

    this.definitionSubscription.updateRange(this.definitionPosition);
    this.nameSubscription.updateRange(this.namePosition);
    if (this.valuePosition) {
      if (this.valueSubscription) {
        this.valueSubscription.updateRange(this.valuePosition);
      } else {
        this.valueSubscription = new SpanSubscription(
          this.model,
          this.valuePosition
        );
      }
    }
  }
}

export type InstanceDataChangedEvent = {
  instanceData: ComponentInstanceData;
};

export type ComponentDataChangedEvent = {
  componentData: StaticComponentInformation | undefined;
};

export interface IComponentInstanceModel {
  didInstanceDataChange: Event<InstanceDataChangedEvent>;
  didComponentDataChange: Event<ComponentDataChangedEvent>;

  getId(): string;
  getName(): string;

  getInstanceProp(name: string): InstanceProp | undefined;
  getInstanceInformation(): ComponentInstanceData;
  getComponentInformation(): Promise<StaticComponentInformation | undefined>;

  setFiberProp(name: string, value: any): Promise<void>;
  addProp(name: string): Promise<void>;
}

/**
 * A class that takes all the three different types of data in:
 * - Component
 * - Component Instance
 * - Fiber
 *
 * And gives the functions needed to extract needed data, manipulate it, etc...
 */
export class ComponentInstanceModel
  extends Disposable
  implements IComponentInstanceModel {
  private componentInfo: StaticComponentInformation | undefined;
  public codePosition: CodeRange;
  /**
   * The code position that it got when initializing, this one is not optimistically updated,
   * only on full updates or when newly initialized;
   */
  public originalCodePosition: CodeRange;
  private subscription: SpanSubscription;

  props: {
    [key: string]: InstanceProp;
  };

  private didInstanceDataChangeEmitter = new Emitter<
    InstanceDataChangedEvent
  >();
  public didInstanceDataChange = this.didInstanceDataChangeEmitter.event;

  private didComponentDataChangeEmitter = new Emitter<
    ComponentDataChangedEvent
  >();
  public didComponentDataChange = this.didComponentDataChangeEmitter.event;

  constructor(
    private instanceData: ComponentInstanceData,
    private model: IModel,
    private sandboxProxy: ISandboxProxy,
    private editorApi: IEditorInterface,
    private inspector: EditorInspectorState
  ) {
    super();

    this.props = {};
    Object.keys(instanceData.props).forEach(key => {
      const instanceProp = new InstanceProp(
        model,
        this,
        instanceData.props[key]
      );
      this.toDispose.push(instanceProp);
      this.props[key] = instanceProp;
    });

    this.codePosition = instanceData.location.codePosition;
    this.originalCodePosition = instanceData.location.codePosition;
    this.toDispose.push(
      model.onWillDispose(() => {
        this.dispose();
      })
    );

    this.subscription = new SpanSubscription(
      model,
      instanceData.location.codePosition,
      RangeStickinessBehaviour.NeverGrowsWhenTypingAtEdges
    );
    this.toDispose.push(this.subscription);

    this.toDispose.push(
      this.subscription.onDidRangeChange(e => {
        this.codePosition = e.range;
      })
    );
  }

  public getId() {
    return `${this.codePosition.startLineNumber}:${this.codePosition.startColumnNumber}`;
  }

  public getName() {
    return this.instanceData.name;
  }

  public getInstanceProp(name: string) {
    return this.props[name];
  }

  public getInstanceInformation() {
    return this.instanceData;
  }

  async getComponentInformation() {
    const data = this.getInstanceInformation();
    const fromPath = data.location.path;
    const relativePath = data.importLocation?.importPath;
    const exportName = data.importLocation?.importName;

    if (!relativePath || !exportName) {
      return undefined;
    }

    this.componentInfo = await this.inspector.getComponentInformation(
      relativePath,
      fromPath,
      exportName
    );

    this.didComponentDataChangeEmitter.fire({
      componentData: this.componentInfo,
    });

    return this.componentInfo;
  }

  updateModel(instance: ComponentInstanceData) {
    this.instanceData = instance;
    this.codePosition = instance.location.codePosition;
    this.originalCodePosition = instance.location.codePosition;

    Object.keys(instance.props).forEach(prop => {
      const existingPropInstance = this.props[prop];

      if (existingPropInstance) {
        existingPropInstance.updateProp(instance.props[prop]);
      } else {
        this.props[prop] = new InstanceProp(
          this.model,
          this,
          instance.props[prop]
        );
      }
    });

    Object.keys(this.props).forEach(propName => {
      if (!instance.props[propName]) {
        this.props[propName].dispose();
        delete this.props[propName];
      }
    });

    this.didInstanceDataChangeEmitter.fire({ instanceData: instance });
  }

  private componentModelListener: ComponentInfoModelListener | undefined;

  public async select() {
    const componentInfo =
      this.componentInfo || (await this.getComponentInformation());
    if (!componentInfo) {
      return;
    }

    /**
     * Listen to changes to the component definition
     */
    this.componentModelListener = new ComponentInfoModelListener(
      this.editorApi,
      componentInfo.path
    );
    this.componentModelListener.componentInfoDidChange(() => {
      this.getComponentInformation();
    });
    this.toDispose.push(this.componentModelListener);
  }

  public unselect() {
    if (this.componentModelListener) {
      this.componentModelListener.dispose();
    }
  }

  public async setFiberProp(name: string, value: any) {
    const fiber = this.inspector.getFiberFromInstance(this);

    if (!fiber) {
      throw new Error("Can't find fiber for " + name);
    }

    await this.sandboxProxy.$setFiberProp(fiber.id, [name], value);
  }

  public async addProp(name: string) {
    const componentInformation = await this.getComponentInformation();

    if (!componentInformation) {
      throw new Error("Can't resolve component information");
    }

    const propInfo = componentInformation.props.find(p => p.name === name);
    if (!propInfo) {
      throw new Error("This prop doesn't exist on the component");
    }

    const currentComponentCode = this.subscription.getContent();

    let initializerType = InitializerType.Expression;
    if (propInfo.typeInfo?.type === 'string') {
      initializerType = InitializerType.String;
    } else if (propInfo.typeInfo?.type === 'boolean') {
      initializerType = InitializerType.Boolean;
    }
    const newCode = addProp(currentComponentCode, name, initializerType);
    this.subscription.setContent(newCode);
  }
}

class ComponentInfoModelListener extends Disposable {
  private componentInfoDidChangeEmitter = new Emitter<void>();
  public componentInfoDidChange = this.componentInfoDidChangeEmitter.event;

  constructor(private editorApi: IEditorInterface, path: string) {
    super();

    const model = this.editorApi
      .getModels()
      .find(model => model.getResource().path === path);

    if (model) {
      this.listenToModel(model);
    }

    this.toDispose.push(
      this.editorApi.onModelAdded(event => {
        if (event.model.getResource().path === path) {
          this.listenToModel(event.model);
        }
      })
    );
  }

  private componentModelListener: IDisposable | undefined;
  listenToModel(model: IModel) {
    if (this.componentModelListener) {
      this.componentModelListener.dispose();
    }

    const disposable = model.onDidChangeContent(() => {
      // Wait for the other event listeners to finish first. As one of those will send
      // the new contents to the analyzer, which we then can use to ask for new info.
      setTimeout(() => {
        this.componentInfoDidChangeEmitter.fire();
      }, 0);
    });

    this.componentModelListener = disposable;
    this.toDispose.push(this.componentModelListener);
  }
}
