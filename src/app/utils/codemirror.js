import CodeMirror from 'codemirror';
import { injectGlobal, keyframes } from 'styled-components';
import theme from 'common/theme';

import 'codemirror/lib/codemirror.css';
import 'codemirror/addon/dialog/dialog.css';
import 'codemirror/addon/hint/show-hint.css';
import 'codemirror/addon/tern/tern.css';
import 'codemirror/mode/jsx/jsx';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/fold/xml-fold'; // Needed to match JSX
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';

const fadeInAnimation = keyframes`
  0%   { background-color: #374140; }
  100% { background-color: #561011; }
`;

// eslint-disable-next-line
export const getCodeMirror = (el, doc) => {
  // eslint-disable-next-line
  injectGlobal`
    .cm-s-oceanic.CodeMirror {
      font-family: 'Source Code Pro', monospace;
      background: ${theme.background2()};
      color: #e0e0e0;
      height: 100%;
      font-weight: 500;
    }
    .cm-s-oceanic div.CodeMirror-selected { background: #374140; }
    .cm-s-oceanic .CodeMirror-line::selection, .cm-s-oceanic .CodeMirror-line > span::selection, .cm-s-oceanic .CodeMirror-line > span > span::selection { background: #65737E; }
    .cm-s-oceanic .CodeMirror-line::-moz-selection, .cm-s-oceanic .CodeMirror-line > span::-moz-selection, .cm-s-oceanic .CodeMirror-line > span > span::-moz-selection { background: #65737E; }
    .cm-s-oceanic .CodeMirror-gutters {
      background: ${theme.background2()};
      border-right: 0px;
    }
    .cm-s-oceanic .CodeMirror-guttermarker { color: #ac4142; }
    .cm-s-oceanic .CodeMirror-guttermarker-subtle { color: #505050; }
    .cm-s-oceanic .CodeMirror-linenumber { color: #505050; }
    .cm-s-oceanic .CodeMirror-cursor { border-left: 1px solid #b0b0b0; }

    .cm-s-oceanic span.cm-comment { color: #626466; }
    .cm-s-oceanic span.cm-atom { color: #aa759f; }
    .cm-s-oceanic span.cm-number { color: #aa759f; }

    .cm-s-oceanic span.cm-property, .cm-s-oceanic span.cm-attribute { color: #aa759f; }
    .cm-s-oceanic span.cm-keyword { color: ${theme.secondary()}; }
    .cm-s-oceanic span.cm-string { color: #99C794; }

    .cm-s-oceanic span.cm-variable { color: ${theme.primary.darken(0.1)()}; }
    .cm-s-oceanic span.cm-variable-2 { color: ${theme.secondary()}; }
    .cm-s-oceanic span.cm-def { color: #FAC863; }
    .cm-s-oceanic span.cm-bracket { color: #e0e0e0; }
    .cm-s-oceanic span.cm-tag { color: #EC5f67; }
    .cm-s-oceanic span.cm-link { color: #aa759f; }
    .cm-s-oceanic span.cm-error { background: #ac4142; color: #b0b0b0; }

    .cm-s-oceanic .CodeMirror-activeline-background { background: #374140; }
    .cm-s-oceanic .CodeMirror-matchingbracket { text-decoration: underline; color: white !important; }
    .cm-s-oceanic span.CodeMirror-matchingtag { background-color: inherit; }
    .cm-s-oceanic span.cm-tag.CodeMirror-matchingtag { text-decoration: underline; }
    .cm-s-oceanic span.cm-tag.cm-bracket.CodeMirror-matchingtag { text-decoration: none; }

    .cm-s-oceanic div.cm-line-error.CodeMirror-linebackground { animation: ${fadeInAnimation} 0.3s; background-color: #561011; }
  `;

  const cm = new CodeMirror(el, {
    value: doc,
    theme: 'oceanic',
    keyMap: 'sublime',
    indentUnit: 2,
    autoCloseBrackets: true,
    matchTags: { bothTags: true },
    foldGutter: true,
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    lineNumbers: true,
    lineWrapping: true,
    styleActiveLine: true,
    lint: false,
  });

  return cm;
};
