import { ModuleCorrection, ModuleError } from '@codesandbox/common/lib/types';
import { CorrectionClearAction } from 'codesandbox-api/dist/types/actions/correction';
import { ErrorClearAction } from 'codesandbox-api/dist/types/actions/error';

export function clearCorrectionsFromAction<
  T extends ModuleCorrection | ModuleError
>(
  currentCorrections: T[],
  action: CorrectionClearAction | ErrorClearAction
): T[] {
  if (action.path === '*') {
    return currentCorrections.filter(cor => cor.source !== action.source);
  }

  return currentCorrections.filter(
    cor => cor.source !== action.source && cor.path !== action.path
  );
}
