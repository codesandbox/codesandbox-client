import * as React from 'react';
import { PrismHighlight } from './CodeViewer/PrismHighlight';
import { useTranspiledCode } from '../hooks/useTranspiledCode';
import { useSandpack } from '../hooks/useSandpack';

export interface TranspiledCodeViewProps {
  customStyle?: React.CSSProperties;
}

export const TranspiledCodeView: React.FC<TranspiledCodeViewProps> = ({
  customStyle,
}) => {
  const { sandpack } = useSandpack();
  const transpiledCode = useTranspiledCode();

  return (
    <div className="sp-stack" style={{ position: 'relative', ...customStyle }}>
      {transpiledCode && <PrismHighlight code={transpiledCode} />}
      {sandpack.error && (
        <div className="sp-overlay sp-error">
          <span className="sp-error-message">{sandpack.error.message}</span>
        </div>
      )}
    </div>
  );
};
