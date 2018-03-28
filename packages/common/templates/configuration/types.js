// @flow
import type { Sandbox } from 'common/types';

export type ConfigurationFile = {
  title: string,
  type: string,
  description: string,
  moreInfoUrl: string,

  getDefaultCode?: (
    template: string,
    resolveModule: (path: string) => ?{ code: string }
  ) => string,
  generateFileFromState?: (state: any) => string,
  generateFileFromSandbox?: (sandbox: Sandbox) => string,

  schema?: string,
  partialSupportDisclaimer?: string,
};
