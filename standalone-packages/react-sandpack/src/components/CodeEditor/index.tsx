import * as React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../contexts/sandpack-context';
import { FileTabs } from '../FileTabs';
import { RunIcon } from '../../icons';

export type CodeEditorOptions = {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
};
export type CodeEditorProps = CodeEditorOptions & {
  customStyle?: React.CSSProperties;
};

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
    sandpack.updateCurrentFile(newCode);
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
            bottom: 'var(--sp-space-2)',
            right: 'var(--sp-space-2)',
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
