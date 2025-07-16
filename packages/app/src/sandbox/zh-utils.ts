import { dispatch } from 'codesandbox-api';

// keep a ref to the promise resolution so we can wait for or access the token
let resolvedConfig: (data: { token: string; zhUrl: string }) => void = null;
const configPromise = new Promise<{ token: string; zhUrl: string }>(
  (resolve, _reject) => {
    resolvedConfig = resolve;
  }
);

export const getZhExampleBuildVar = () => {
  // example variable we can get from build variables
  return process.env.ZH_EXAMPLE_VAR;
};

export const setZhToken = (token: string, url: string) => {
  resolvedConfig?.({ token, zhUrl: url });
};

export const makeZhRequest = async (path: string, init: RequestInit = {}) => {
  const { token, zhUrl } = await configPromise;

  if (token) {
    await fetch(`${zhUrl}${path}`, {
      headers: { authorization: `Bearer ${token}` },
      ...init,
    });
  }
};

export const dispatchCompiledCode = (hash: string, code: any) => {
  dispatch({
    type: 'zh_compiled_code',
    hash,
    code,
  });
};
