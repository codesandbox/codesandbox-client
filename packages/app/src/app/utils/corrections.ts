import { ModuleCorrection } from '@codesandbox/common/lib/types';
import { CorrectionClearAction } from 'codesandbox-api/dist/types/actions/correction';

export function clearCorrectionsFromAction(
  currentCorrections: ModuleCorrection[],
  action: CorrectionClearAction
) {
  if (action.path === '*') {
    return currentCorrections.filter(cor => cor.source !== action.source);
  }

  return currentCorrections.filter(
    cor => cor.source !== action.source && cor.path !== action.path
  );
}
