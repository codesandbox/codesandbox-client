import { Selection, TextOperation } from 'ot';
import { VSCodeRange } from '@codesandbox/common/lib/types';
import {
  indexToLineAndColumn,
  lineAndColumnToIndex,
} from 'app/overmind/utils/common';
import vscodeEffect from './';

function rangeEquals(a: VSCodeRange, b: VSCodeRange) {
  return (
    a.startLineNumber === b.startLineNumber &&
    a.endLineNumber === b.endLineNumber &&
    a.startColumn === b.startColumn &&
    a.endColumn === b.endColumn
  );
}

type ContentListener = (newContent: string) => void;
type RangeChangeListener = (newRange: VSCodeRange) => void;

export class SpanSubscription {
  private disposables: monaco.IDisposable[] = [];
  private otRange: Selection.Range;
  private textSpan: string;

  constructor(
    private model: monaco.editor.ITextModel,
    private vscode: typeof vscodeEffect,
    private vsCodeRange: VSCodeRange
  ) {
    const lines = model.getLinesContent();
    this.otRange = new Selection.Range(
      lineAndColumnToIndex(
        lines,
        vsCodeRange.startLineNumber,
        vsCodeRange.startColumn
      ),
      lineAndColumnToIndex(
        lines,
        vsCodeRange.endLineNumber,
        vsCodeRange.endColumn
      )
    );

    this.disposables.push(
      this.vscode.onModelDidChange(model, change =>
        this.handleContentChange(change)
      )
    );

    this.textSpan = model.getValueInRange(vsCodeRange);
  }

  dispose() {
    this.disposables.forEach(disposable => {
      disposable.dispose();
    });
  }

  private contentListeners = new Set<ContentListener>();
  onContentChange(listener: ContentListener) {
    this.contentListeners.add(listener);

    return {
      dispose: () => {
        this.contentListeners.delete(listener);
      },
    };
  }

  private rangeListeners = new Set<RangeChangeListener>();
  onRangeChange(listener: RangeChangeListener) {
    this.rangeListeners.add(listener);

    return {
      dispose: () => {
        this.rangeListeners.delete(listener);
      },
    };
  }

  private handleContentChange(change: TextOperation) {
    this.otRange = this.otRange.transform(change);

    const lines = this.model.getLinesContent();
    const rangeStart = indexToLineAndColumn(lines, this.otRange.anchor);
    const rangeEnd = indexToLineAndColumn(lines, this.otRange.head);
    const monacoRange: VSCodeRange = {
      startLineNumber: rangeStart.lineNumber,
      endLineNumber: rangeEnd.lineNumber,
      startColumn: rangeStart.column,
      endColumn: rangeEnd.column,
    };

    const newTextSpan = this.model.getValueInRange(monacoRange);

    if (newTextSpan !== this.textSpan) {
      this.textSpan = newTextSpan;
      this.contentListeners.forEach(listener => listener(this.textSpan));
    }

    const sameRange = rangeEquals(this.vsCodeRange, monacoRange);
    if (!sameRange) {
      this.vsCodeRange = monacoRange;
      this.rangeListeners.forEach(listener => listener(this.vsCodeRange));
    }
  }
}
