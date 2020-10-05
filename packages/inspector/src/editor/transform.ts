import { TextOperation } from 'ot';

function transformIndex(operation: TextOperation, index: number) {
  let newIndex = index;
  let opIndex = 0;

  operation.ops.forEach(op => {
    if (opIndex >= newIndex) {
      return;
    }

    if (TextOperation.isRetain(op)) {
      opIndex += op as number;
    } else if (TextOperation.isDelete(op)) {
      opIndex += op as number;
      newIndex += op as number;
    } else if (TextOperation.isInsert(op)) {
      opIndex += (op as string).length;
      newIndex += (op as string).length;
    }
  });

  return newIndex;
}

export function transform(operation: TextOperation, otRange: [number, number]) {
  const [head, anchor] = otRange;
  return [transformIndex(operation, head), transformIndex(operation, anchor)];
}
