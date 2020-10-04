import { EditorInspectorState } from '.';
import {
  ComponentInstanceData,
  Fiber,
  StaticComponentInformation,
} from '../common/fibers';
import { ISandboxProxy } from '../common/proxies';
import { Disposable } from '../common/rpc/disposable';
import { IEditorInterface, IModel } from './editor-api';
import {
  RangeStickinessBehaviour,
  SpanSubscription,
} from './span-subscription';

// TODO: make an interface for this

export interface IComponentInstanceModel {
  getInstanceInformation(): ComponentInstanceData;
  getComponentInformation(): Promise<StaticComponentInformation>;
}

/**
 * A class that takes all the three different types of data in:
 * - Component
 * - Component Instance
 * - Fiber
 *
 * And gives the functions needed to extract needed data, manipulate it, etc...
 */
export class ComponentInstanceModel extends Disposable
  implements IComponentInstanceModel {
  componentInfo: StaticComponentInformation | undefined;

  constructor(
    private instanceData: ComponentInstanceData,
    private model: IModel,
    private sandboxProxy: ISandboxProxy,
    private editorApi: IEditorInterface,
    private inspector: EditorInspectorState
  ) {
    super();

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
}
