import React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../utils/sandpack-context';
import { FileTabs } from '../FileTabs';
import { styled } from '../../stitches.config';

export interface CodeEditorProps {
  style?: React.CSSProperties;
  commitOnSave?: boolean;
  lang?: 'js' | 'html';
  showTabs?: boolean;
}

const CodeEditorWrapper = styled('div', {
  backgroundColor: '$neutral900',
  textAlign: 'left',
});

export const CodeEditor = ({
  style,
  commitOnSave = false,
  lang,
  showTabs = false,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();
  const { activePath } = sandpack;
  const code = sandpack.files[activePath].code;

  const handleCodeUpdate = (newCode: string) => {
    sandpack.updateCurrentFile({
      code: newCode,
    });
  };

  return (
    <CodeEditorWrapper style={style}>
      {showTabs && <FileTabs />}
      <CodeMirror
        activePath={activePath}
        code={code}
        lang={lang}
        onCodeUpdate={handleCodeUpdate}
        commitOnSave={commitOnSave}
      />
    </CodeEditorWrapper>
  );
};
