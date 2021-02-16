import * as React from 'react';
import { RunIcon } from '../../icons';

import { useSandpack } from '../../hooks/useSandpack';
import { FileTabs } from '../FileTabs';
import { PrismHighlight } from './PrismHighlight';
import { getPrismLanguage } from './utils';
import { useActiveCode } from '../../hooks/useActiveCode';

export interface CodeViewerProps {
  style?: React.CSSProperties;
  showTabs?: boolean;
  showLineNumbers?: boolean;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  showTabs,
  ...rest
}) => {
  const { sandpack } = useSandpack();
  const { code } = useActiveCode();
  const { activePath, status, runSandpack } = sandpack;

  const lang = getPrismLanguage(activePath);
  const shouldShowTabs = showTabs ?? sandpack.openPaths.length > 1;

  return (
    <div className="sp-stack">
      {shouldShowTabs && <FileTabs />}
      <PrismHighlight {...rest} code={code} lang={lang} />
      {status === 'idle' && (
        <button
          type="button"
          className="sp-button"
          style={{
            position: 'absolute',
            bottom: 'var(--sp-space-2)',
            right: 'var(--sp-space-2)',
          }}
          onClick={() => runSandpack()}
        >
          <RunIcon />
          Run
        </button>
      )}
    </div>
  );
};
