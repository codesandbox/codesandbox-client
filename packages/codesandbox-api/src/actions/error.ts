import { Action } from './';

export interface ErrorOptions {
  line?: number;
  column?: number;
  path?: string;
  lineEnd?: number;
  columnEnd?: number;
  source?: string;
  payload?: Object;
}

export interface ErrorAction extends Action {
  title: string;
  message: string;
  line?: number;
  lineEnd?: number;
  column?: number;
  columnEnd?: number;
  path?: string;
  payload?: Object;
  severity: 'error';
  source: string;
}

export interface ErrorClearAction extends Action {
  type: 'action';
  action: 'clear-errors';
  path: string;
  source: string;
}

/**
 * Returns an action that describes to show an error
 * in the code of the editor (with the red squiggles)
 *
 * @export
 * @param {string} title
 * @param {string} message
 * @param {ErrorOptions} { line, column, path, payload }
 * @returns {ErrorAction}
 */
export function show(
  title: string,
  message: string,
  { line, column, lineEnd, columnEnd, path, payload, source }: ErrorOptions
): ErrorAction {
  return {
    title,
    message,
    line,
    column,
    path,
    payload,
    lineEnd,
    columnEnd,
    severity: 'error',
    type: 'action',
    action: 'show-error',
    source: source || 'browser',
  };
}

export function clear(path: string, source: 'all' | string): ErrorClearAction {
  return {
    type: 'action',
    action: 'clear-errors',
    path,
    source,
  };
}
