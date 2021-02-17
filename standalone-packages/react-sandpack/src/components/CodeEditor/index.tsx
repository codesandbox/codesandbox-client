import * as React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../hooks/useSandpack';
import { FileTabs } from '../FileTabs';
import { RunIcon } from '../../icons';
import { useActiveCode } from '../../hooks/useActiveCode';

export type CodeEditorOptions = {
  showTabs?: boolean;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
};
export type CodeEditorProps = CodeEditorOptions & {
  customStyle?: React.CSSProperties;
};

export const SandpackCodeEditor = ({
  customStyle,
  showTabs,
  showLineNumbers = false,
  wrapContent = false,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();
  const { code, updateCode } = useActiveCode();
  const { activePath, status, editorState, runSandpack } = sandpack;
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  const handleCodeUpdate = (newCode: string) => {
    updateCode(newCode);
  };

  return (
    <div className="sp-stack" style={customStyle}>
      {shouldShowTabs && <FileTabs />}
      <div className="sp-editor-frame">
        <CodeMirror
          activePath={activePath}
          code={code}
          key={activePath}
          editorState={editorState}
          onCodeUpdate={handleCodeUpdate}
          showLineNumbers={showLineNumbers}
          wrapContent={wrapContent}
        />
      </div>

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
