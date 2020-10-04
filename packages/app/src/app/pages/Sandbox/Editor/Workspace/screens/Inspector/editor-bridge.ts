import vscodeEffect from 'app/overmind/effects/vscode';
import { CodeRange } from 'inspector/lib/common/fibers';
import { Disposable } from 'inspector/lib/common/rpc/disposable';
import { Emitter } from 'inspector/lib/common/rpc/event';
import {
  IEditorInterface,
  IModel,
  OnModelAddedEvent,
  OnModelRemovedEvent,
  Resource,
} from 'inspector/lib/editor/editor-api';
import { componentRangeToViewRange } from './utils';

export class VSCodeEditorBridge extends Disposable implements IEditorInterface {
  onModelAddedEmitter = new Emitter<OnModelAddedEvent>();
  onModelAdded = this.onModelAddedEmitter.event;
  onModelRemovedEmitter = new Emitter<OnModelRemovedEvent>();
  onModelRemoved = this.onModelRemovedEmitter.event;

  constructor(private vscode: typeof vscodeEffect) {
    super();

    this.toDispose.push(
      vscode.onModelAdded(model => {
        this.onModelAddedEmitter.fire({ model });
      })
    );

    this.toDispose.push(
      vscode.onModelRemoved(model => {
        this.onModelRemovedEmitter.fire({ model });
      })
    );
  }

  openModel(resource: Resource): Promise<IModel> {
    return this.vscode.openModel(resource);
  }

  getModels() {
    return this.vscode.getModels();
  }

  async setSelectionOnActiveEditor(range: CodeRange) {
    return this.vscode.setSelectionFromRange(componentRangeToViewRange(range));
  }
}
