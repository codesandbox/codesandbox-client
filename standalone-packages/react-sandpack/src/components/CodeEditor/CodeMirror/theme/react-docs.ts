import { EditorView } from '@codemirror/view';
import { Extension } from '@codemirror/state';

// const chalky = '#e5c07b';
// const coral = '#e06c75';
// const dark = '#5c6370';
// const fountainBlue = '#56b6c2';
// const green = '#98c379';
// const invalid = '#ffffff';
// const lightDark = '#1F2933';
const lightWhite = '#1F2933';
// const malibu = '#61afef';
// const purple = '#c678dd';
// const whiskey = '#d19a66';
const background = '#F8F9FB';
const selection = '#ebedf0';
const cursor = '#528bff';

const reactDocsTheme = EditorView.theme({
  $: {
    color: lightWhite,
    backgroundColor: background,
    '& ::selection': { backgroundColor: '#ebedf0' },
    caretColor: cursor,
  },

  '$$focused $cursor': { borderLeftColor: cursor },
  '$$focused $selectionBackground': { backgroundColor: selection },

  $panels: { backgroundColor: background, color: lightWhite },
  '$panels.top': { borderBottom: '2px solid black' },
  '$panels.bottom': { borderTop: '2px solid black' },

  $searchMatch: {
    backgroundColor: '#72a1ff59',
    outline: '1px solid #457dff',
  },
  '$searchMatch.selected': {
    backgroundColor: '#6199ff2f',
  },

  $activeLine: { backgroundColor: '#ebedf0' },
  $selectionMatch: { backgroundColor: '#aafe661a' },

  '$matchingBracket, $nonmatchingBracket': {
    backgroundColor: '#bad0f847',
    outline: '1px solid #515a6b',
  },

  $gutters: {
    backgroundColor: background,
    color: '#545868',
    border: 'none',
  },
  '$gutterElement.lineNumber': { color: 'inherit' },

  $foldPlaceholder: {
    backgroundColor: 'none',
    border: 'none',
    color: '#ddd',
  },

  $tooltip: {
    border: '1px solid #181a1f',
    backgroundColor: '#606862',
  },
  '$tooltip.autocomplete': {
    '& > li[aria-selected]': { backgroundColor: background },
  },
});

// const reactDocsHighlighter = highlighter({
//   invalid: { color: invalid },
//   comment: { color: lightDark },
//   keyword: { color: '#1a56db' },
//   'name, deleted': { color: coral },
//   'operator, operatorKeyword, regexp': { color: fountainBlue },
//   'string, inserted': { color: '#1992D4' },
//   propertyName: { color: malibu },
//   'color, name constant, name standard': { color: whiskey },
//   'name definition': { color: lightWhite },
//   'typeName, className, number, changed': { color: '#1a56db' },
//   meta: { color: dark },
//   strong: { fontWeight: 'bold' },
//   emphasis: { fontStyle: 'italic' },
//   link: { color: dark, textDecoration: 'underline' },
//   heading: { fontWeight: 'bold', color: coral },
//   'atom, bool': { color: whiskey },
// });

// / Extension to enable the One Dark theme.
export const reactDocs: Extension = [reactDocsTheme]; // reactDocsHighlighter];
