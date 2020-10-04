import { Selection, TextOperation } from 'ot';
import { Disposable } from '../common/rpc/disposable';
import { IModel } from './editor-api';
import { CodeRange } from '../common/fibers';
import {
  lineAndColumnToIndex,
  indexToLineAndColumn,
} from '../common/utils/code-location';
import { Emitter } from '../common/rpc/event';

function rangeEquals(a: CodeRange, b: CodeRange) {
  return (
    a.startLineNumber === b.startLineNumber &&
    a.endLineNumber === b.endLineNumber &&
    a.startColumnNumber === b.startColumnNumber &&
    a.endColumnNumber === b.endColumnNumber
  );
}

export enum RangeStickinessBehaviour {
  AlwaysGrowWhenTypingAtEdges,
  NeverGrowsWhenTypingAtEdges,
  GrowsOnlyWhenTypingAfter,
  GrowsOnlyWhenTypingBefore,
}

export class SpanSubscription extends Disposable {
  private otRange: Selection.Range;
  private textSpan: string;

  private onDidContentChangeEmitter = new Emitter<{
    oldContent: string;
    content: string;
    operation: TextOperation;
  }>();
  public onDidContentChange = this.onDidContentChangeEmitter.event;

  private onDidRangeChangeEmitter = new Emitter<{
    oldRange: CodeRange;
    range: CodeRange;
    operation: TextOperation;
  }>();
  public onDidRangeChange = this.onDidRangeChangeEmitter.event;

  constructor(
    private model: IModel,
    private range: CodeRange,
    private stickinessBehaviour = RangeStickinessBehaviour.GrowsOnlyWhenTypingAfter
  ) {
    super();

    this.toDispose.push(
      model.onWillDispose(() => {
        this.dispose();
      })
    );

    const lines = model.getLinesContent();
    this.otRange = new Selection.Range(
      lineAndColumnToIndex(
        lines,
        range.startLineNumber,
        range.startColumnNumber
      ),
      lineAndColumnToIndex(lines, range.endLineNumber, range.endColumnNumber)
    );

    this.toDispose.push(
      model.onDidChangeContent(change =>
        this.handleContentChange(change.operation)
      )
    );

    this.textSpan = model.getValueInRange(range);
  }

  private getOtRangeModifiers() {
    if (
      this.stickinessBehaviour ===
      RangeStickinessBehaviour.NeverGrowsWhenTypingAtEdges
    ) {
      return {
        preTransform: (otRange: Selection.Range) =>
          new Selection.Range(otRange.anchor, Math.max(0, otRange.head - 1)),
        postTransform: (otRange: Selection.Range) =>
          new Selection.Range(
            otRange.anchor,
            otRange.head === 0 ? 0 : otRange.head + 1
          ),
      };
    }
    return {
      preTransform: (otRange: Selection.Range) => otRange,
      postTransform: (otRange: Selection.Range) => otRange,
    };
  }

  private handleContentChange(change: TextOperation) {
    const { preTransform, postTransform } = this.getOtRangeModifiers();
    this.otRange = postTransform(preTransform(this.otRange).transform(change));

    const lines = this.model.getLinesContent();
    const rangeStart = indexToLineAndColumn(lines, this.otRange.anchor);
    const rangeEnd = indexToLineAndColumn(lines, this.otRange.head);
    const newRange: CodeRange = {
      startLineNumber: rangeStart.lineNumber,
      endLineNumber: rangeEnd.lineNumber,
      startColumnNumber: rangeStart.column,
      endColumnNumber: rangeEnd.column,
    };

    const newTextSpan = this.model.getValueInRange(newRange);

    if (newTextSpan !== this.textSpan) {
      const oldTextSpan = this.textSpan;
      this.textSpan = newTextSpan;
      this.onDidContentChangeEmitter.fire({
        content: this.textSpan,
        oldContent: oldTextSpan,
        operation: change,
      });
    }

    const sameRange = rangeEquals(this.range, newRange);
    if (!sameRange) {
      const oldRange = this.range;
      this.range = newRange;
      this.onDidRangeChangeEmitter.fire({
        range: newRange,
        oldRange,
        operation: change,
      });
    }
  }
}
