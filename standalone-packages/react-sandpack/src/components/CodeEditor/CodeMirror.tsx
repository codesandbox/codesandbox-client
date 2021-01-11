import * as React from 'react';

import {
  highlightSpecialChars,
  highlightActiveLine,
  keymap,
  EditorView,
  KeyBinding,
} from '@codemirror/view';
import { indentOnInput } from '@codemirror/language';
import { EditorState } from '@codemirror/state';
import { history, historyKeymap } from '@codemirror/history';
import { defaultKeymap, indentLess, indentMore } from '@codemirror/commands';
import { lineNumbers } from '@codemirror/gutter';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';

import { commentKeymap } from '@codemirror/comment';

import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getSyntaxHighlight,
} from './utils';

import { styled } from '../../stitches.config';
import { ThemeContext } from '../../utils/theme-context';

export interface CodeMirrorProps {
  code: string;
  activePath: string;
  onCodeUpdate: (newCode: string) => void;
  showLineNumbers?: boolean;
}

const Container = styled('div', {
  padding: '$4 $2',
  flex: 1,
  width: '100%',

  '.cm-wrap': {
    height: '100%',
  },

  '.cm-content': {
    padding: 0,
  },

  '.cm-light .cm-content': {
    caretColor: '$highlightText',
  },

  '.cm-focused': {
    outline: 'none',
  },

  '.cm-scroller': {
    fontFamily: '$mono',
  },

  '.cm-gutter-lineNumber': {
    paddingRight: '$2',
  },

  '.cm-gutterElement.cm-gutterElement-lineNumber': {
    padding: 0,
  },
});

export const CodeMirror: React.FC<CodeMirrorProps> = ({
  code,
  activePath,
  onCodeUpdate,
  showLineNumbers = false,
}) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const cmView = React.useRef<EditorView>();
  const theme = React.useContext(ThemeContext);

  React.useEffect(() => {
    if (!wrapper.current) {
      return () => {};
    }

    const langSupport = getCodeMirrorLanguage(activePath);

    const customCommandsKeymap: KeyBinding[] = [
      {
        key: 'Tab',
        run: indentMore,
      },
      {
        key: 'Shift-Tab',
        run: indentLess,
      },
    ];

    const extensions = [
      highlightSpecialChars(),
      history(),
      indentOnInput(),
      bracketMatching(),
      closeBrackets(),
      highlightActiveLine(),

      keymap.of([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...historyKeymap,
        ...commentKeymap,
        ...customCommandsKeymap,
      ]),
      langSupport,
      getEditorTheme(theme),
      getSyntaxHighlight(theme),
    ];

    if (showLineNumbers) {
      extensions.push(lineNumbers());
    }

    const startState = EditorState.create({
      doc: code,
      extensions,
    });

    const view = new EditorView({
      state: startState,
      parent: wrapper.current,
      dispatch: tr => {
        view.update([tr]);

        if (tr.docChanged) {
          onCodeUpdate(tr.newDoc.sliceString(0, tr.newDoc.length));
        }
      },
    });

    cmView.current = view;

    return () => {
      view.destroy();
    };
  }, [showLineNumbers, activePath]);

  return <Container ref={wrapper} />;
};
