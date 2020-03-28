import { TextOperation } from 'ot';

import { lineAndColumnToIndex } from './common';

export default function convertChangeEventToOperation(
  changeEvent: any,
  liveOperationCode: string
) {
  let otOperation: TextOperation;

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

    otOperation = otOperation! ? otOperation!.compose(newOt) : newOt;

    composedCode = otOperation!.apply(liveOperationCode);
  }

  return {
    operation: otOperation!,
    newCode: composedCode,
  };
}
