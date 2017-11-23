import { Action } from './';

export interface ErrorOptions {
  line?: number;
  column?: number;
  path?: string;
  payload?: Object;
}

export interface ErrorAction extends Action {
  title: string;
  message: string;
  line?: number;
  column?: number;
  path?: string;
  payload?: Object;
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
  { line, column, path, payload }: ErrorOptions
): ErrorAction {
  return {
    title,
    message,
    line,
    column,
    path,
    payload,
    type: 'action',
    action: 'show-error',
  };
}
