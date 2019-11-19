import { lineAndColumnToIndex } from 'app/utils/monaco-index-converter';
import { TextOperation } from 'ot';

export default function convertChangeEventToOperation(
  changeEvent,
  liveOperationCode
) {
  let otOperation;

  let composedCode = liveOperationCode;

  // eslint-disable-next-line no-restricted-syntax
  for (const change of [...changeEvent.changes]) {
    const newOt = new TextOperation();
    const cursorStartOffset = lineAndColumnToIndex(
      composedCode.split(/\n/),
      change.range.startLineNumber,
      change.range.startColumn
    );

    const retain = cursorStartOffset - newOt.targetLength;

    if (retain !== 0) {
      newOt.retain(retain);
    }

    if (change.rangeLength > 0) {
      newOt.delete(change.rangeLength);
    }

    if (change.text) {
      newOt.insert(change.text);
    }

    const remaining = composedCode.length - newOt.baseLength;
    if (remaining > 0) {
      newOt.retain(remaining);
    }

    otOperation = otOperation ? otOperation.compose(newOt) : newOt;

    composedCode = otOperation.apply(liveOperationCode);
  }

  return {
    operation: otOperation,
    newCode: composedCode,
  };
}
