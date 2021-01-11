import * as React from 'react';

import { useSandpack } from '../../utils/sandpack-context';
import { PrismHighlight } from './PrismHighlight';
import { getPrismLanguage } from './utils';

export interface CodeViewerProps {
  style?: React.CSSProperties;
  showLineNumbers?: boolean;
}

export const CodeViewer = (props: CodeViewerProps) => {
  const { sandpack } = useSandpack();
  const { activePath } = sandpack;
  const code = sandpack.files[activePath].code;
  const lang = getPrismLanguage(activePath);

  return <PrismHighlight {...props} code={code} lang={lang} />;
};
