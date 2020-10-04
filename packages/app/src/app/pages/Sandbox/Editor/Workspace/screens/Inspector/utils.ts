import { VSCodeRange } from '@codesandbox/common/lib/types';
import { CodeRange } from 'inspector/lib/common/fibers';

export function componentRangeToViewRange(range: CodeRange): VSCodeRange {
  return {
    startLineNumber: range.startLineNumber,
    endLineNumber: range.endLineNumber,
    startColumn: range.startColumnNumber,
    endColumn: range.endColumnNumber,
  };
}
