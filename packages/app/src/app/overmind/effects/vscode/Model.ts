import convertChangeEventToOperation from 'app/overmind/utils/event-to-transform';
import { CodeRange } from 'inspector/lib/common/fibers';
import { Disposable } from 'inspector/lib/common/rpc/disposable';
import { Emitter } from 'inspector/lib/common/rpc/event';
import {
  IModel,
  OnDidChangeContentEvent,
} from 'inspector/lib/editor/editor-api';

/**
 * Takes a model from VSCode, and converts it to a generic model fit for the purposes of CodeSandbox
 */
export class TextModel extends Disposable implements IModel {
  onDidChangeContentEmitter = new Emitter<OnDidChangeContentEvent>();
  onDidChangeContent = this.onDidChangeContentEmitter.event;
  lastKnownCode: string;

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
}
