import { CodePosition } from 'inspector/lib/common/fibers';
import { Disposable, IDisposable } from 'inspector/lib/common/rpc/disposable';
import { Emitter, Event } from 'inspector/lib/common/rpc/event';
import {
  IEditor,
  IModel,
  OnDidChangeCursorPositionEvent,
  OnDidChangeModelEvent,
} from 'inspector/lib/editor/editor-api';

interface VSCodeEditor extends IDisposable {
  getId(): string;
}

export class Editor extends Disposable implements IEditor {
  private onDidChangeModelEmitter = new Emitter<OnDidChangeModelEvent>();
  onDidChangeModel = this.onDidChangeModelEmitter.event;

  private onDidChangeCursorPositionEmitter = new Emitter<
    OnDidChangeCursorPositionEvent
  >();
  onDidChangeCursorPosition = this.onDidChangeCursorPositionEmitter.event;

  constructor(private editor: VSCodeEditor) {
    super();

    this.toDispose.push(this.editor);
  }

  getId(): string {
    return this.editor.getId();
  }

  getModel(): IModel {
    throw new Error('Method not implemented.');
  }
}
