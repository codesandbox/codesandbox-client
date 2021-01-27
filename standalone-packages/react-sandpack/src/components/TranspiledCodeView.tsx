import * as React from 'react';
import { SandpackState } from '../types';
import { useSandpack } from '../utils/sandpack-context';
import { PrismHighlight } from './CodeViewer/PrismHighlight';

function getTranspiledCode(sandpack: SandpackState) {
  const { activePath, bundlerState } = sandpack;
  if (bundlerState == null) {
    return null;
  }

  const tModule = bundlerState.transpiledModules[activePath + ':'];
  return tModule?.source?.compiledCode ?? null;
}

export const TranspiledCodeView: React.FC = () => {
  const { sandpack } = useSandpack();
  if (sandpack.status !== 'running') {
    return null;
  }

  const transpiledCode = getTranspiledCode(sandpack);

  return (
    <div>
      {transpiledCode && <PrismHighlight code={transpiledCode} />}
      {sandpack.errors.length > 0 && (
        <div className="sp-error">{sandpack.errors[0].message}</div>
      )}
    </div>
  );
};
