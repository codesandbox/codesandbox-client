import React, { useRef, useEffect } from 'react';

import {
  highlightSpecialChars,
  drawSelection,
  indentOnInput,
  keymap,
  EditorView,
} from '@codemirror/next/view';

import { EditorState } from '@codemirror/next/state';
import { history, historyKeymap } from '@codemirror/next/history';
import { foldKeymap } from '@codemirror/next/fold';
import { defaultKeymap } from '@codemirror/next/commands';
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
import { reactDocs } from './theme/react-docs';

import { styled } from '../../stitches.config';
import { useSandpack } from '../../utils/sandpack-context';

export interface CodeEditorProps {
  style?: React.CSSProperties;
}

const Container = styled('div', {
  '.ͼ1.cm-focused': {
    outline: 'none',
  },
});

export const CodeEditor = ({ style }: CodeEditorProps) => {
  const wrapper = useRef<HTMLDivElement | null>(null);
  const cmView = useRef<EditorView>();
  const sandpack = useSandpack();

  useEffect(() => {
    if (!wrapper.current || !sandpack) {
      return () => {};
    }

    const startState = EditorState.create({
      doc: sandpack.files[sandpack.openedPath]?.code || '',
      extensions: [
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
        ]),
        reactDocs,
        javascript({ jsx: true }),
      ],
    });

    const view = new EditorView({
      state: startState,
      parent: wrapper.current,
      dispatch: tr => {
        view.update([tr]);

        if (tr.docChanged) {
          sandpack.updateCurrentFile({
            code: tr.newDoc.sliceString(0, tr.newDoc.length),
          });
        }
      },
    });

    cmView.current = view;

    return () => {
      view.destroy();
    };
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const view = cmView.current;
    const currentCode = sandpack.files[sandpack.openedPath]?.code || '';

    if (view && currentCode !== view.state.sliceDoc(0, view.state.doc.length)) {
      view.update([
        view.state.update({
          changes: {
            from: 0,
            to: view?.state.doc.length,
            insert: currentCode,
          },
        }),
      ]);
    }
    // eslint-disable-next-line
  }, [sandpack.openedPath, cmView]);

  return <Container style={style} ref={wrapper} />;
};
