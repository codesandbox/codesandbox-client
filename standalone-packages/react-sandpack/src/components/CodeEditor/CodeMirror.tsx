import * as React from 'react';

import {
  highlightSpecialChars,
  highlightActiveLine,
  keymap,
  EditorView,
  KeyBinding,
} from '@codemirror/view';
import { EditorState } from '@codemirror/state';
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

import { commentKeymap } from '@codemirror/comment';

import {
  getCodeMirrorLanguage,
  getEditorTheme,
  getSyntaxHighlight,
} from './utils';

import { ThemeContext } from '../../utils/theme-context';
import { getFileName } from '../../utils/string-utils';

export interface CodeMirrorProps {
  code: string;
  activePath: string;
  onCodeUpdate: (newCode: string) => void;
  showLineNumbers?: boolean;
}

export const CodeMirror: React.FC<CodeMirrorProps> = ({
  code,
  activePath,
  onCodeUpdate,
  showLineNumbers = false,
}) => {
  const wrapper = React.useRef<HTMLDivElement>(null);
  const cmView = React.useRef<EditorView>();
  const mounted = React.useRef<boolean>(false);
  const theme = React.useContext(ThemeContext);
  const [internalCode, setInternalCode] = React.useState<string>(code);

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
          const newCode = tr.newDoc.sliceString(0, tr.newDoc.length);
          setInternalCode(newCode);
          onCodeUpdate(newCode);
        }
      },
    });

    cmView.current = view;

    return () => {
      view.destroy();
    };
  }, [showLineNumbers, activePath, theme]);

  React.useEffect(() => {
    const view = cmView.current;

    if (!view || !mounted.current) {
      mounted.current = true;
      return;
    }

    // force focus inside the editor when tabs change
    // but ignore the first time the hook is called (when the component mounts)
    view.contentDOM.setAttribute('tabIndex', '-1');
    view.contentDOM.setAttribute('aria-describedby', 'exit-instructions');
    view.contentDOM.focus();
  }, [activePath]);

  React.useEffect(() => {
    if (!cmView.current || code === internalCode) {
      return;
    }

    const view = cmView.current;

    view.update([
      view.state.update({
        changes: {
          from: 0,
          to: view?.state.doc.length,
          insert: code,
        },
      }),
    ]);

    setInternalCode(code);
  }, [code]);

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
