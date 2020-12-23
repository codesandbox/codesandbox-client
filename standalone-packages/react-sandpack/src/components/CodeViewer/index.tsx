import React, { useEffect } from 'react';
import Prism from 'prismjs';
import { useSandpack } from '../../utils/sandpack-context';
import './prism.css';

export interface CodeViewerProps {
  style?: React.CSSProperties;
  lang?: 'javascript' | 'html';
}

export const CodeViewer = ({ style, lang = 'javascript' }: CodeViewerProps) => {
  const { sandpack } = useSandpack();
  const openedPath = sandpack.openedPath;
  const code = sandpack.files[openedPath].code;

  useEffect(() => {
    Prism.highlightAll();
  }, []);

  return (
    <pre style={style}>
      <code className={`language-${lang}`}>{code}</code>
    </pre>
  );
};
