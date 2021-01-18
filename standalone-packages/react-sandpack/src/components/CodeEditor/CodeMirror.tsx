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
import { getFileName } from '../../utils/string-utils';

export interface CodeMirrorProps {
  code: string;
  activePath: string;
  onCodeUpdate: (newCode: string) => void;
  showLineNumbers?: boolean;
}

const Container = styled('div', {
  padding: '$4 $0',
  flex: 1,
  width: '100%',
  position: 'relative',
  outline: 'none',

  ':focus': {
    boxShadow: 'inset 0 0 0 4px $accent',
    paddingLeft: '$1',
    paddingRight: '$1',
  },

  ':focus:not(:focus-visible)': {
    boxShadow: 'none',
  },

  ':focus-visible': {
    boxShadow: 'inset 0 0 0 4px $accent',
  },

  ':focus .cm-line': {
    padding: '0 $2',
  },

  '.cm-wrap': {
    height: '100%',
  },

  '.cm-content': {
    padding: 0,
  },

  '.cm-line': {
    padding: '0 $3',
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
      {
        key: 'Escape',
        run: () => {
          if (wrapper.current) {
            wrapper.current.focus();
          }

          return true;
        },
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

    // force focus inside the editor when tabs change
    view.contentDOM.setAttribute('tabIndex', '-1');
    view.contentDOM.focus();

    return () => {
      view.destroy();
    };
  }, [showLineNumbers, activePath, theme]);

  const handleContainerKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && cmView.current) {
      evt.preventDefault();
      cmView.current.contentDOM.focus();
    }
  };

  return (
    <Container
      onKeyDown={handleContainerKeyDown}
      tabIndex={0}
      role="group"
      aria-label={`Code Editor for ${getFileName(activePath)}`}
      /* eslint-disable jsx-a11y/aria-props */
      aria-description="To enter the code editing mode, press Enter. To exit the edit mode, press Escape"
      ref={wrapper}
    />
  );
};
