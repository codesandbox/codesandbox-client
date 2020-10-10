import { Disposable } from 'inspector/lib/common/rpc/disposable';
import { Emitter } from 'inspector/lib/common/rpc/event';
import {
  ICodeEditor,
  IModel,
  OnDidChangeCursorPositionEvent,
  OnDidChangeModelEvent,
} from 'inspector/lib/editor/editor-api';
import { TextModel } from './Model';

export class CodeEditor extends Disposable implements ICodeEditor {
  private onDidChangeModelEmitter = new Emitter<OnDidChangeModelEvent>();
  public onDidChangeModel = this.onDidChangeModelEmitter.event;

  private onDidChangeCursorPositionEmitter = new Emitter<
    OnDidChangeCursorPositionEvent
  >();
  public onDidChangeCursorPosition = this.onDidChangeCursorPositionEmitter
    .event;

  constructor(private editor: monaco.editor.ICodeEditor) {
    super();

    this.toDispose.push(this.editor);

    this.toDispose.push(
      this.editor.onDidChangeModel(event => {
        this.onDidChangeModelEmitter.fire({
          newModelUri: event.newModelUrl
            ? {
                path: event.newModelUrl.path,
                scheme: event.newModelUrl.scheme,
              }
            : null,
          oldModelUri: event.oldModelUrl
            ? {
                path: event.oldModelUrl.path,
                scheme: event.oldModelUrl.scheme,
              }
            : null,
        });
      })
    );

    this.toDispose.push(
      this.editor.onDidChangeCursorPosition(event => {
        this.onDidChangeCursorPositionEmitter.fire({
          position: {
            lineNumber: event.position.lineNumber,
            columnNumber: event.position.column,
          },
          source: event.source,
          secondaryPositions: event.secondaryPositions.map(p => ({
            lineNumber: p.lineNumber,
            columnNumber: p.column,
          })),
        });
      })
    );
  }

  getId(): string {
    return this.editor.getId();
  }

  getModel(): IModel | null {
    const vscodeModel = this.editor.getModel();
    if (vscodeModel) {
      return new TextModel(vscodeModel);
    }

    return null;
  }
}
