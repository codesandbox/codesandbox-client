import React, { useRef, useEffect } from 'react';

import {
  highlightSpecialChars,
  drawSelection,
  indentOnInput,
  keymap,
  EditorView,
  KeyBinding,
} from '@codemirror/next/view';
import { EditorState } from '@codemirror/next/state';
import { history, historyKeymap } from '@codemirror/next/history';
import { foldKeymap } from '@codemirror/next/fold';
import {
  defaultKeymap,
  indentLess,
  indentMore,
} from '@codemirror/next/commands';
import { lineNumbers } from '@codemirror/next/gutter';
import { bracketMatching } from '@codemirror/next/matchbrackets';
import {
  closeBrackets,
  closeBracketsKeymap,
} from '@codemirror/next/closebrackets';
import { searchKeymap } from '@codemirror/next/search';
import {
  autocompletion,
  completionKeymap,
} from '@codemirror/next/autocomplete';
import { commentKeymap } from '@codemirror/next/comment';
import { rectangularSelection } from '@codemirror/next/rectangular-selection';
import { gotoLineKeymap } from '@codemirror/next/goto-line';
import {
  highlightActiveLine,
  highlightSelectionMatches,
} from '@codemirror/next/highlight-selection';
import { defaultHighlighter } from '@codemirror/next/highlight';
import { lintKeymap } from '@codemirror/next/lint';
import { javascript } from '@codemirror/next/lang-javascript';
import { html } from '@codemirror/next/lang-html';
import { reactDocs } from './theme/react-docs';

import { styled } from '../../../stitches.config';

export interface CodeMirrorProps {
  code: string;
  activePath: string;
  onCodeUpdate: (newCode: string) => void;
  lang?: 'js' | 'html';
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

  '.cm-focused': {
    outline: 'none',
  },

  '.cm-scroller': {
    fontFamily: '$mono',
  },

  '.cm-gutter-lineNumber': {
    paddingRight: '$2',
    color: '$defaultText',
  },

  '.cm-gutterElement.cm-gutterElement-lineNumber': {
    padding: 0,
  },
});

export const CodeMirror: React.FC<CodeMirrorProps> = ({
  code,
  activePath,
  onCodeUpdate,
  lang = 'js',
  showLineNumbers = false,
}) => {
  const wrapper = useRef<HTMLDivElement>(null);
  const cmView = useRef<EditorView>();

  useEffect(() => {
    if (!wrapper.current) {
      return () => {};
    }

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
      drawSelection(),
      EditorState.allowMultipleSelections.of(true),
      indentOnInput(),
      defaultHighlighter,
      bracketMatching(),
      closeBrackets(),
      autocompletion(),
      rectangularSelection(),
      highlightActiveLine(),
      highlightSelectionMatches(),

      keymap([
        ...closeBracketsKeymap,
        ...defaultKeymap,
        ...searchKeymap,
        ...historyKeymap,
        ...foldKeymap,
        ...commentKeymap,
        ...gotoLineKeymap,
        ...completionKeymap,
        ...lintKeymap,
        ...customCommandsKeymap,
      ]),
      lang === 'js' ? javascript({ jsx: true }) : html(),
      reactDocs,
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
  }, [lang, showLineNumbers]);

  useEffect(() => {
    const view = cmView.current;
    if (view && code !== view.state.sliceDoc(0, view.state.doc.length)) {
      view.update([
        view.state.update({
          changes: {
            from: 0,
            to: view?.state.doc.length,
            insert: code,
          },
        }),
      ]);
    }
    // eslint-disable-next-line
  }, [activePath]);

  return <Container ref={wrapper} />;
};
