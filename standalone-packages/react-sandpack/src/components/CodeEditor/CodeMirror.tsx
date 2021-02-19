import * as React from 'react';

import {
  highlightSpecialChars,
  highlightActiveLine,
  keymap,
  EditorView,
  KeyBinding,
} from '@codemirror/view';
import { history, historyKeymap } from '@codemirror/history';
import {
  defaultKeymap,
  indentLess,
  indentMore,
  deleteGroupBackward,
} from '@codemirror/commands';
import { lineNumbers } from '@codemirror/gutter';
import { bracketMatching } from '@codemirror/matchbrackets';
import { closeBrackets, closeBracketsKeymap } from '@codemirror/closebrackets';
import { EditorState } from '@codemirror/state';
import { commentKeymap } from '@codemirror/comment';

import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getSyntaxHighlight,
} from './utils';

import { ThemeContext } from '../../contexts/theme-context';
import { getFileName } from '../../utils/string-utils';
import { EditorState as SandpackEditorState } from '../../types';

export interface CodeMirrorProps {
  code: string;
  activePath: string;
  onCodeUpdate: (newCode: string) => void;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
  editorState: SandpackEditorState;
}

export const CodeMirror: React.FC<CodeMirrorProps> = ({
  code,
  activePath,
  onCodeUpdate,
  showLineNumbers = false,
  wrapContent = false,
  editorState,
}) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const cmView = React.useRef<EditorView>();
  const { theme } = React.useContext(ThemeContext);

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
      {
        key: 'mod-Backspace',
        run: deleteGroupBackward,
      },
    ];

    const extensions = [
      highlightSpecialChars(),
      history(),
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

    if (wrapContent) {
      extensions.push(EditorView.lineWrapping);
    }

    if (showLineNumbers) {
      extensions.push(lineNumbers());
    }

    const startState = EditorState.create({
      doc: code,
      extensions,
    });

    const parentDiv = wrapper.current;
    const existingPlaceholder = parentDiv.querySelector('.sp-pre-placeholder');
    if (existingPlaceholder) {
      parentDiv.removeChild(existingPlaceholder);
    }

    const view = new EditorView({
      state: startState,
      parent: parentDiv,
      dispatch: tr => {
        view.update([tr]);

        if (tr.docChanged) {
          const newCode = tr.newDoc.sliceString(0, tr.newDoc.length);
          onCodeUpdate(newCode);
        }
      },
    });

    view.contentDOM.setAttribute('tabIndex', '-1');
    view.contentDOM.setAttribute('aria-describedby', 'exit-instructions');
    if (editorState === 'dirty') {
      view.contentDOM.focus();
    }

    cmView.current = view;

    return () => {
      view.destroy();
    };
  }, [showLineNumbers, wrapContent, theme]);

  const handleContainerKeyDown = (evt: React.KeyboardEvent) => {
    if (evt.key === 'Enter' && cmView.current) {
      evt.preventDefault();
      cmView.current.contentDOM.focus();
    }
  };

  return (
    /* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
    /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
    <div
      className="sp-cm"
      onKeyDown={handleContainerKeyDown}
      tabIndex={0}
      role="group"
      aria-label={`Code Editor for ${getFileName(activePath)}`}
      aria-describedby="enter-instructions"
      ref={wrapper}
    >
      <pre
        className="sp-pre-placeholder"
        style={{
          marginLeft: showLineNumbers ? 28 : 0, // gutter line offset
        }}
      >
        {code}
      </pre>
      <p id="enter-instructions" style={{ display: 'none' }}>
        To enter the code editing mode, press Enter. To exit the edit mode,
        press Escape
      </p>
      <p id="exit-instructions" style={{ display: 'none' }}>
        You are editing the code. To exit the edit mode, press Escape
      </p>
    </div>
  );
};
