import { useSandpack } from './useSandpack';

export const useActiveCode = () => {
  const { sandpack } = useSandpack();

  return {
    code: sandpack.files[sandpack.activePath].code,
    updateCode: sandpack.updateCurrentFile,
  };
};
