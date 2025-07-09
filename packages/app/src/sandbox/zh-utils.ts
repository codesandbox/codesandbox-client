import { NpmRegistry } from '@codesandbox/common/lib/types';
import { dispatch } from 'codesandbox-api';

export const getZhSandpackMode = (): 'editor' | 'viewer' => {
  return window.location.host.split('.')[0] === 'editor' ? 'editor' : 'viewer';
};

export const getZhExampleBuildVar = () => {
  // example variable we can get from build variables
  return process.env.ZH_EXAMPLE_VAR;
};

export const makeZhRequest = async (
  registries: NpmRegistry[],
  path: string,
  init: RequestInit = {}
) => {
  // example using the custom registries data to pass specific
  const sandpackDetails = registries.find(
    registry =>
      registry.enabledScopes.length === 1 &&
      registry.enabledScopes[0] === '@zh-engineer/livecode'
  );

  if (sandpackDetails) {
    await fetch(`${sandpackDetails.registryUrl}${path}`, {
      headers: { authorization: `Bearer ${sandpackDetails.registryAuthToken}` },
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
