import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../hooks/useSandpack';
import { FileTabs } from '../FileTabs';
import { useActiveCode } from '../../hooks/useActiveCode';
import { RunButton } from '../../common/RunButton';
import { SandpackStack } from '../../common/Stack';

export type CodeEditorProps = {
  customStyle?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
  wrapContent?: boolean;
};

export const SandpackCodeEditor = ({
  customStyle,
  showTabs,
  showLineNumbers = false,
  wrapContent = false,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();
  const { code, updateCode } = useActiveCode();
  const { activePath, status, editorState } = sandpack;
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  const c = useClasser('sp');

  const handleCodeUpdate = (newCode: string) => {
    updateCode(newCode);
  };

  return (
    <SandpackStack customStyle={customStyle}>
      {shouldShowTabs && <FileTabs />}
      <div className={c('code-editor')}>
        <CodeMirror
          activePath={activePath}
          code={code}
          key={activePath}
          editorState={editorState}
          onCodeUpdate={handleCodeUpdate}
          showLineNumbers={showLineNumbers}
          wrapContent={wrapContent}
        />

        {status === 'idle' && <RunButton />}
      </div>
    </SandpackStack>
  );
};
