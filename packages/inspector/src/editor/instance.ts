import { EditorInspectorState } from '.';
import {
  CodeRange,
  ComponentInstanceData,
  Fiber,
  SourcePropInfo,
  StaticComponentInformation,
} from '../common/fibers';
import { ISandboxProxy } from '../common/proxies';
import { Disposable } from '../common/rpc/disposable';
import { Emitter, Event } from '../common/rpc/event';
import { IEditorInterface, IModel } from './editor-api';
import {
  RangeStickinessBehaviour,
  SpanSubscription,
} from './span-subscription';

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

export interface IComponentInstanceModel {
  didInstanceDataChange: Event<InstanceDataChangedEvent>;

  getInstanceProp(name: string): InstanceProp | undefined;
  getInstanceInformation(): ComponentInstanceData;
  getComponentInformation(): Promise<StaticComponentInformation>;

  setFiberProp(name: string, value: any): Promise<void>;
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
  componentInfo: StaticComponentInformation | undefined;
  codePosition: CodeRange;
  props: {
    [key: string]: InstanceProp;
  };

  private didInstanceDataChangeEmitter = new Emitter<
    InstanceDataChangedEvent
  >();
  public didInstanceDataChange = this.didInstanceDataChangeEmitter.event;

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
    this.toDispose.push(
      model.onWillDispose(() => {
        this.dispose();
      })
    );

    const subscription = new SpanSubscription(
      model,
      instanceData.location.codePosition,
      RangeStickinessBehaviour.NeverGrowsWhenTypingAtEdges
    );
    this.toDispose.push(subscription);

    this.toDispose.push(
      subscription.onDidRangeChange(e => {
        this.codePosition = e.range;
      })
    );
  }

  getInstanceProp(name: string) {
    return this.props[name];
  }

  getInstanceInformation() {
    return this.instanceData;
  }

  async getComponentInformation() {
    const fiber = this.inspector.getFiberFromInstance(this);

    if (!fiber) {
      throw new Error("Can't find fiber");
    }

    if (!this.componentInfo) {
      this.componentInfo = await this.sandboxProxy.$getFiberComponentInformation(
        fiber.id
      );
    }

    return this.componentInfo;
  }

  updateModel(instance: ComponentInstanceData) {
    this.instanceData = instance;
    this.codePosition = instance.location.codePosition;

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

  public async setFiberProp(name: string, value: any) {
    const fiber = this.inspector.getFiberFromInstance(this);

    if (!fiber) {
      throw new Error("Can't find fiber for " + name);
    }

    await this.sandboxProxy.$setFiberProp(fiber.id, [name], value);
  }
}
