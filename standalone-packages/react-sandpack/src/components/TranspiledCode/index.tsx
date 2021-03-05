import * as React from 'react';
import { useClasser } from '@code-hike/classer';
import { PrismHighlight } from '../../common/PrismHighlight';
import { useTranspiledCode } from '../../hooks/useTranspiledCode';
import { ErrorOverlay } from '../../common/ErrorOverlay';
import { LoadingOverlay } from '../../common/LoadingOverlay';

export const SandpackTranspiledCode: React.FC = () => {
  const transpiledCode = useTranspiledCode();
  const c = useClasser('sp');

  return (
    <div className={c('transpiled-code')}>
      {transpiledCode && <PrismHighlight code={transpiledCode} />}
      <ErrorOverlay />
      <LoadingOverlay />
    </div>
  );
};
