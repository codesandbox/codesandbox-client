import * as React from 'react';
import { styled } from '../../stitches.config';

import { useSandpack } from '../../utils/sandpack-context';
import { FileTabs } from '../FileTabs';
import { PrismHighlight } from './PrismHighlight';
import { getPrismLanguage } from './utils';

export interface CodeViewerProps {
  style?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
}

const CodeViewerWrapper = styled('div', {
  backgroundColor: '$mainBackground',
  border: '1px solid $inactive',
  margin: -1,
  textAlign: 'left',
  display: 'flex',
  flexDirection: 'column',
});

export const CodeViewer: React.FC<CodeViewerProps> = ({
  showTabs,
  ...rest
}) => {
  const { sandpack } = useSandpack();
  const { activePath } = sandpack;
  const code = sandpack.files[activePath].code;
  const lang = getPrismLanguage(activePath);

  return (
    <CodeViewerWrapper>
      {showTabs && <FileTabs />}
      <PrismHighlight {...rest} code={code} lang={lang} />
    </CodeViewerWrapper>
  );
};
