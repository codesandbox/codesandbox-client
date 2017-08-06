import extractAbbreviation from '@emmetio/extract-abbreviation';
import { expand } from '@emmetio/expand-abbreviation';

const field = (index, placeholder) => '';

const expandAbbreviation = (source, language) => {
  return expand(source.abbreviation, {
    field,
    syntax: language,
    addons: {
      jsx: true,
    },
  });
};

const enableEmmet = (editor, monaco) => {
  if (!editor) {
    throw new Error('Must provide monaco-editor instance.');
  }
  editor.addCommand(monaco.KeyCode.Tab, () => {
    let word = editor.model.getValueInRange(editor.getSelection());
    const pos = editor.getPosition();
    if (!word) {
      const lineContent = editor.model.getLineContent(pos.lineNumber);
      word = extractAbbreviation(lineContent.substring(0, pos.column));
    }

    // Get expand text
    const expandText = expandAbbreviation(word, 'html');
    if (expandText) {
      // replace range content: pos.column , pos.column -word.length;
      const range = new monaco.Range(
        pos.lineNumber,
        pos.column - word.abbreviation.length,
        pos.lineNumber,
        pos.column,
      );
      const id = { major: 1, minor: 1 };
      const op = {
        identifier: id,
        range,
        text: expandText,
        forceMoveMarkers: true,
      };
      editor.executeEdits('', [op]);
    }
  });
};

export default enableEmmet;
