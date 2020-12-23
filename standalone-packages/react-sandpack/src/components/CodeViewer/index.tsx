import React from 'react';
import { useSandpack } from '../../utils/sandpack-context';
import { PrismHighlight } from './PrismHighlight';

export interface CodeViewerProps {
  style?: React.CSSProperties;
  lang?: 'javascript' | 'html';
}

export const CodeViewer = (props: CodeViewerProps) => {
  const { sandpack } = useSandpack();
  const { activePath } = sandpack;
  const code = sandpack.files[activePath].code;

  return <PrismHighlight {...props}>{code}</PrismHighlight>;
};
