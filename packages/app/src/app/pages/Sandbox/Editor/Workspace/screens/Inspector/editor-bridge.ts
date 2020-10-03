import vscodeEffect from 'app/overmind/effects/vscode';
import { Disposable } from 'inspector/lib/common/rpc/disposable';
import { Emitter } from 'inspector/lib/common/rpc/event';
import {
  IEditorInterface,
  OnModelAddedEvent,
  OnModelRemovedEvent,
} from 'inspector/lib/editor/editor-api';

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

  getModels() {
    return this.vscode.getModels();
  }
}
