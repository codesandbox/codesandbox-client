import * as React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../utils/sandpack-context';
import { FileTabs } from '../FileTabs';
import { styled } from '../../stitches.config';

export interface CodeEditorProps {
  style?: React.CSSProperties;
  lang?: 'js' | 'html';
  showTabs?: boolean;
  showLineNumbers?: boolean;
}

const CodeEditorWrapper = styled('div', {
  backgroundColor: '$mainBackground',
  border: '1px solid $inactive',
  margin: -1,
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
});

export const CodeEditor = ({
  style,
  lang,
  showTabs = false,
  showLineNumbers = false,
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
        showLineNumbers={showLineNumbers}
      />
    </CodeEditorWrapper>
  );
};
