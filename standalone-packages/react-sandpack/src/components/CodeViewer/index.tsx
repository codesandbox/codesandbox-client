import * as React from 'react';
import { RunIcon } from '../../icons';

import { useSandpack } from '../../contexts/sandpack-context';
import { FileTabs } from '../FileTabs';
import { PrismHighlight } from './PrismHighlight';
import { getPrismLanguage } from './utils';

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
  const { activePath, status, runSandpack } = sandpack;
  const code = sandpack.files[activePath].code;
  const lang = getPrismLanguage(activePath);

  return (
    <div>
      {showTabs && <FileTabs />}
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
