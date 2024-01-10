import { Sandbox } from '@codesandbox/common/lib/types';

export const isPrivateScope = (sandbox: Sandbox, input: string): boolean => {
  if (!input.startsWith('@')) {
    return false;
  }

  const [scope] = input.split('/');

  const registries = sandbox.npmRegistries;
  return registries.some(
    r => r.limitToScopes && r.enabledScopes.some(s => s === scope)
  );
};
