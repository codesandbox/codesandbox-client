import { useSandpack } from './useSandpack';
import { SandpackState } from '../types';

function getTranspiledCode(sandpack: SandpackState) {
  const { activePath, bundlerState } = sandpack;
  if (bundlerState == null) {
    return null;
  }

  const tModule = bundlerState.transpiledModules[activePath + ':'];
  return tModule?.source?.compiledCode ?? null;
}

export const useTranspiledCode = () => {
  const { sandpack } = useSandpack();
  if (sandpack.status !== 'running') {
    return null;
  }

  return getTranspiledCode(sandpack);
};
