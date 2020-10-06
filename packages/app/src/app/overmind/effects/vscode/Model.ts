import { indexToLineAndColumn } from 'app/overmind/utils/common';
import convertChangeEventToOperation from 'app/overmind/utils/event-to-transform';
import { CodeRange, CodeSelection } from 'inspector/lib/common/fibers';
import { Disposable } from 'inspector/lib/common/rpc/disposable';
import { Emitter } from 'inspector/lib/common/rpc/event';
import {
  IModel,
  OnDidChangeContentEvent,
} from 'inspector/lib/editor/editor-api';
import { TextOperation } from 'ot';

/**
 * Takes a model from VSCode, and converts it to a generic model fit for the purposes of CodeSandbox
 */
export class TextModel extends Disposable implements IModel {
  private onDidChangeContentEmitter = new Emitter<OnDidChangeContentEvent>();
  public onDidChangeContent = this.onDidChangeContentEmitter.event;
  private lastKnownCode: string;

  constructor(private vscodeModel: monaco.editor.ITextModel) {
    super();

    this.lastKnownCode = vscodeModel.getValue();

    this.toDispose.push(
      vscodeModel.onDidChangeContent(e => {
        const { operation } = convertChangeEventToOperation(
          e,
          this.lastKnownCode
        );
        this.lastKnownCode = vscodeModel.getValue();

        this.onDidChangeContentEmitter.fire({ operation });
      })
    );

    vscodeModel.onWillDispose(() => {
      this.dispose();
    });
  }

  getResource() {
    const uri = this.vscodeModel.uri;
    return {
      path: uri.path,
      scheme: uri.scheme,
    };
  }

  getVersionId() {
    return this.vscodeModel.getVersionId();
  }

  getValue() {
    return this.vscodeModel.getValue();
  }

  getValueInRange(range: CodeRange) {
    return this.vscodeModel.getValueInRange({
      startLineNumber: range.startLineNumber,
      endLineNumber: range.endLineNumber,
      startColumn: range.startColumnNumber,
      endColumn: range.endColumnNumber,
    });
  }

  getLinesContent() {
    return this.vscodeModel.getLinesContent();
  }

  pushEditOperation(
    selections: CodeSelection[],
    operation: TextOperation
  ): CodeSelection[] {
    const model = this.vscodeModel;
    const results: Array<{
      range: monaco.Range;
      text: string;
      forceMoveMarkers?: boolean;
    }> = [];
    let index = 0;
    const currentEOLLength = model.getEOL().length;
    let eolChanged = false;
    const modelCode = this.getValue();

    if (operation.baseLength !== modelCode.length) {
      throw new Error(
        "The base length of the operation doesn't match the length of the code"
      );
    }

    for (let i = 0; i < operation.ops.length; i++) {
      const op = operation.ops[i];
      if (TextOperation.isRetain(op)) {
        index += op as number;
      } else if (TextOperation.isInsert(op)) {
        const textOp = op as string;
        const lines = this.getLinesContent();
        const { lineNumber, column } = indexToLineAndColumn(lines || [], index);
        const range = new monaco.Range(lineNumber, column, lineNumber, column);

        results.push({
          range,
          text: textOp,
          forceMoveMarkers: true,
        });
      } else if (TextOperation.isDelete(op)) {
        const delOp = op as number;
        const lines = this.getLinesContent();
        const from = indexToLineAndColumn(lines, index);
        const to = indexToLineAndColumn(lines, index - delOp);
        const range = new monaco.Range(
          from.lineNumber,
          from.column,
          to.lineNumber,
          to.column
        );
        results.push({
          range,
          text: '',
        });
        index -= delOp;
      }
    }

    if (eolChanged) {
      const newEolMode = currentEOLLength === 2 ? 0 : 1;
      model.setEOL(newEolMode);
    }

    const vscodeSelections = selections.map(
      sel =>
        new monaco.Selection(
          sel.selectionStartLineNumber,
          sel.selectionStartColumnNumber,
          sel.positionLineNumber,
          sel.positionColumnNumber
        )
    );
    const newSelections = model.pushEditOperations(
      vscodeSelections,
      results,
      () => null
    );

    return (
      newSelections &&
      newSelections.map(sel => ({
        selectionStartLineNumber: sel.selectionStartLineNumber,
        selectionStartColumnNumber: sel.selectionStartColumn,
        positionLineNumber: sel.positionLineNumber,
        positionColumnNumber: sel.positionColumn,
      }))
    );
  }
}
