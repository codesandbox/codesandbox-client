import extractAbbreviation from '@emmetio/extract-abbreviation';
import { expand } from '@emmetio/expand-abbreviation';

const field = () => '';

const expandAbbreviation = (source, language) =>
  expand(source.abbreviation, {
    field,
    syntax: language,
    addons: {
      jsx: true,
    },
  });

const enableEmmet = (editor, monaco) => {
  if (!editor) {
    throw new Error('Must provide monaco-editor instance.');
  }

  editor.addAction({
    // An unique identifier of the contributed action.
    id: 'emmet-abbr',

    // A label of the action that will be presented to the user.
    label: 'Emmet: Expand abbreviation',

    // An optional array of keybindings for the action.
    keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_E], // eslint-disable-line no-bitwise

    // A precondition for this action.
    precondition: null,

    // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
    keybindingContext: null,

    contextMenuGroupId: 'navigation',

    contextMenuOrder: 1.5,

    // Method that will be executed when the action is triggered.
    // @param editor The editor instance is passed in as a convenience
    run: () => {
      let word = editor.model.getValueInRange(editor.getSelection());
      const pos = editor.getPosition();
      if (!word) {
        const lineContent = editor.model.getLineContent(pos.lineNumber);
        word = extractAbbreviation(lineContent.substring(0, pos.column));
      }
      if (word) {
        // Get expand text
        const expandText = expandAbbreviation(word, 'html');
        if (expandText) {
          // replace range content: pos.column , pos.column -word.length;
          const range = new monaco.Range(
            pos.lineNumber,
            pos.column - word.abbreviation.length,
            pos.lineNumber,
            pos.column
          );
          const id = { major: 1, minor: 1 };
          const op = {
            identifier: id,
            range,
            text: expandText,
            forceMoveMarkers: true,
          };
          editor.executeEdits('', [op]);
          return null;
        }
        return false;
      }
      return false;
    },
  });
};

export default enableEmmet;
