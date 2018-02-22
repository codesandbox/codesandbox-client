// @flow
import type { ComponentType } from 'react';
import type { Sandbox } from 'common/types';

export type ConfigurationFile = {
  title: string,
  type: string,
  description: string,
  moreInfoUrl: string,

  getDefaultCode?: (template: string) => string,
  generateFileFromState?: (state: any) => string,
  generateFileFromSandbox?: (sandbox: Sandbox) => string,

  ui?: {
    ConfigWizard: ComponentType<{
      file: string,
      updateFile: (code: string) => void,
    }>,
  },

  schema?: string,
  partialSupportDisclaimer?: string,
};
