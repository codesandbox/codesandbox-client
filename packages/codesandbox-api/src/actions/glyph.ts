import { Action } from './';

export interface GlyphOptions {
  line: number;
  path: string;
  className: string;
}

export interface GlyphAction extends Action {
  line: number;
  path: string;
  className: string;
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
export function show({ line, path, className }: GlyphOptions): GlyphAction {
  return {
    line,
    path,
    className,
    type: 'action',
    action: 'show-glyph',
  };
}
