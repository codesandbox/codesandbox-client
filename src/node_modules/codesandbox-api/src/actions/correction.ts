import { Action } from './';

export interface CorrectionOptions {
  line?: number;
  column?: number;
  path: string;
  payload?: Object;
  severity: 'warning' | 'notice';
  source?: string;
}

export interface CorrectionAction extends Action {
  message: string;
  line?: number;
  column?: number;
  path: string;
  payload?: Object;
  severity: 'warning' | 'notice';
  source?: string;
}

/**
 * Returns an action that describes to show a correction
 * in the code of the editor (with the yellow/blue squiggles)
 *
 * @export
 * @param {string} title
 * @param {string} message
 * @param {CorrectionOptions} { line, column, payload }
 * @returns {CorrectionAction}
 */
export function show(
  message: string,
  {
    line,
    column,
    path,
    payload,
    severity = 'warning',
    source = '',
  }: CorrectionOptions = {
    path: '',
    severity: 'warning',
    source: '',
  }
): CorrectionAction {
  return {
    message,
    line,
    column,
    path,
    payload,
    severity,
    source,
    type: 'action',
    action: 'show-correction',
  };
}
