import * as React from 'react';
import { useSandpack } from '../../hooks/useSandpack';
import { FileTabs } from '../FileTabs';
import { PrismHighlight } from '../../common/PrismHighlight';
import { getPrismLanguage } from './utils';
import { useActiveCode } from '../../hooks/useActiveCode';
import { RunButton } from '../../common/RunButton';
import { SandpackStack } from '../../common/Stack';

export interface CodeViewerProps {
  showTabs?: boolean;
  showLineNumbers?: boolean;
}

export const SandpackCodeViewer: React.FC<CodeViewerProps> = ({
  showTabs,
  showLineNumbers,
}) => {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const { activePath, status } = sandpack;

  const lang = getPrismLanguage(activePath);
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  return (
    <SandpackStack>
      {shouldShowTabs && <FileTabs />}
      <PrismHighlight
        showLineNumbers={showLineNumbers}
        code={code}
        lang={lang}
      />
      {status === 'idle' && <RunButton />}
    </SandpackStack>
  );
};
