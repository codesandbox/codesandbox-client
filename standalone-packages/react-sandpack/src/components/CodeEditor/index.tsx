import React from 'react';
import { CodeMirror } from './CodeMirror';
import { useSandpack } from '../../utils/sandpack-context';

export interface CodeEditorProps {
  style?: React.CSSProperties;
  commitOnSave?: boolean;
  lang?: 'js' | 'html';
}

export const CodeEditor = ({
  style,
  commitOnSave = false,
  lang,
}: CodeEditorProps) => {
  const { sandpack } = useSandpack();
  const openedPath = sandpack.openedPath;
  const code = sandpack.files[openedPath].code;

  const handleCodeUpdate = (newCode: string) => {
    sandpack.updateCurrentFile({
      code: newCode,
    });
  };

  return (
    <CodeMirror
      style={style}
      openedPath={openedPath}
      code={code}
      lang={lang}
      onCodeUpdate={handleCodeUpdate}
      commitOnSave={commitOnSave}
    />
  );
};
