import React from 'react';
import { Language } from 'prism-react-renderer';

import { useSandpack } from '../../utils/sandpack-context';
import { PrismHighlight } from './PrismHighlight';

export interface CodeViewerProps {
  style?: React.CSSProperties;
  lang?: Language;
  showLineNumbers?: boolean;
}

export const CodeViewer = (props: CodeViewerProps) => {
  const { sandpack } = useSandpack();
  const { activePath } = sandpack;
  const code = sandpack.files[activePath].code;

  return <PrismHighlight {...props} code={code} />;
};
