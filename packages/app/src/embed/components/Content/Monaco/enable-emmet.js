import { expand } from '@emmetio/expand-abbreviation';
import enableCombiEmmet from './enable-combi-emmet';

const enableEmmet = (editor, monaco) => {
  if (!editor) {
    throw new Error('Must provide monaco-editor instance.');
  }

  enableCombiEmmet(editor, monaco);

  let cursor;
  let emmetText;
  let expandText;

  // get a legal emmet from a string
  // if whole string matches emmet rules, return it
  // if a substring(right to left) split by white space matches emmet rules, return the substring
  // if nothing matches, return empty string
  const getLegalEmmet = str => {
    // empty or ends with white space, illegal
    if (str === '' || str.match(/\s$/)) return '';

    // deal with white space, this determines how many characters needed to be emmeted
    // e.g. `a span div` => `a span <div></div>` skip `a span `
    // e.g. `a{111 222}` => `<a href="">111 222</a>`
    // conclusion: white spaces are only allowed between `[]` or `{}`
    // note: quotes also allowed white spaces, but quotes must in `[]` or `{}`, so ignore it
    const step = { '{': 1, '}': -1, '[': 1, ']': -1 };
    let pair = 0;

    for (let i = str.length - 1; i > 0; i--) {
      pair += step[str[i]] || 0;
      if (str[i].match(/\s/) && pair >= 0) {
        // illegal white space detected
        str = str.substr(i + 1); // eslint-disable-line
        break;
      }
    }

    // starts with illegal character
    // note: emmet self allowed number element like `<1></1>`,
    // but obviously its not fit html standard, so skip it
    if (!str.match(/^[a-zA-Z[(.#]/)) {
      return '';
    }

    // finally run expand to test the final result
    try {
      expandText = expand(str);
    } catch (e) {
      return '';
    }

    return str;
  };

  // register a context key to make sure emmet triggered at proper condition
  const emmetLegal = editor.createContextKey('emmetLegal', false);

  editor.onDidChangeCursorPosition(cur => {
    // to ensure emmet triggered at the right time
    // we need to do grammar analysis

    const { model } = editor;
    cursor = cur.position;

    const { column } = cursor;
    // there is no character before column 1
    // no need to continue
    if (column === 1) {
      emmetLegal.set(false);
      return;
    }

    const { lineNumber } = cursor;

    /* eslint-disable no-underscore-dangle */

    // force line's state to be accurate
    model.getLineTokens(lineNumber, /* inaccurateTokensAcceptable */ false);
    // get the tokenization state at the beginning of this line
    const state = model.getLinesContent()[lineNumber - 1].getState();
    // deal with state got null when paste
    if (!state) return;

    const freshState = state.clone();
    // get the human readable tokens on this line
    const token = model._tokenizationSupport.tokenize(
      model.getLineContent(lineNumber),
      freshState,
      0
    ).tokens;

    /* eslint-enable */

    // get token type at current cursor position
    let i;
    for (i = token.length - 1; i >= 0; i--) {
      if (column - 1 > token[i].offset) {
        break;
      }
    }

    // type must be empty string when start emmet
    // and if not the first token, make sure the previous token is `delimiter.html`
    // to prevent emmet triggered within attributes
    if (
      token[i].type !== '' ||
      (i > 0 && token[i - 1].type !== 'delimiter.html')
    ) {
      emmetLegal.set(false);
      return;
    }

    // get content starts from current token offset to current cursor column
    emmetText = model
      .getLineContent(lineNumber)
      .substring(token[i].offset, column - 1)
      .trimLeft();

    emmetText = getLegalEmmet(emmetText);
    emmetLegal.set(!!emmetText);
  });

  // add tab command with context
  editor.addCommand(
    monaco.KeyCode.Tab,
    () => {
      // attention: push an undo stop before and after executeEdits
      // to make sure the undo operation is as expected
      editor.pushUndoStop();

      // record first `${0}` position and remove all `${0}`
      /* eslint-disable no-template-curly-in-string */
      const posOffsetArr = expandText.split('${0}')[0].split('\n');
      /* eslint-enable */
      const lineNumber = cursor.lineNumber + posOffsetArr.length - 1;
      const column =
        posOffsetArr.length === 1
          ? posOffsetArr[0].length - emmetText.length + cursor.column
          : posOffsetArr.slice(-1)[0].length + 1;
      expandText = expandText.replace(/\$\{0\}/g, '');

      // replace range text with expandText
      editor.executeEdits('emmet', [
        {
          identifier: { major: 1, minor: 1 },
          range: new monaco.Range(
            cursor.lineNumber,
            cursor.column - emmetText.length,
            cursor.lineNumber,
            cursor.column
          ),
          text: expandText,
          forceMoveMarkers: true,
        },
      ]);

      // move cursor to the position of first `${0}` in expandText
      editor.setPosition(new monaco.Position(lineNumber, column));

      editor.pushUndoStop();
    },
    'emmetLegal && !suggestWidgetVisible'
  );
};

export default enableEmmet;
