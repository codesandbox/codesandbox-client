import * as React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../utils/sandpack-context';
import { FileTabs } from '../FileTabs';
import { RunIcon } from '../../icons';

export interface CodeEditorProps {
  customStyle?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
}

export const CodeEditor = ({
  customStyle,
  showTabs = false,
  showLineNumbers = false,
  wrapContent = false,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();

  const { activePath, status, editorState, runSandpack } = sandpack;
  const code = sandpack.files[activePath].code;

  const handleCodeUpdate = (newCode: string) => {
    sandpack.updateCurrentFile({
      code: newCode,
    });
  };

  return (
    <div style={customStyle}>
      {showTabs && <FileTabs />}
      <CodeMirror
        activePath={activePath}
        code={code}
        key={activePath}
        editorState={editorState}
        onCodeUpdate={handleCodeUpdate}
        showLineNumbers={showLineNumbers}
        wrapContent={wrapContent}
      />
      {status === 'idle' && (
        <button
          type="button"
          className="sp-button"
          style={{
            position: 'absolute',
            bottom: 'var(--space-2)',
            right: 'var(--space-2)',
          }}
          onClick={() => runSandpack()}
        >
          <RunIcon />
          Run
        </button>
      )}
    </div>
  );
};
