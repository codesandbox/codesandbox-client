// All actions of the editor are defined here. The sandbox can send messages
// like `source.files.rename` which the editor will see as an action to rename
// a module. This will allow plugins to alter project content in the future

import * as notifications from './notifications';
import * as editor from './editor';
import * as source from './source';
import * as error from './error';
import * as correction from './correction';
import * as glyph from './glyph';

export interface Action {
  type: 'action';
  action: string;
}

export const actions = {
  notifications,
  editor,
  source,
  error,
  correction,
  glyph,
};
