// @flow
import type { ComponentType } from 'react';

export type ConfigurationFile = {
  title: string,
  type: string,
  description: string,
  moreInfoUrl: string,

  getDefaultCode?: (template: string) => string,
  generateFileFromState?: (state: any) => string,

  ui?: {
    ConfigWizard: ComponentType<{
      file: string,
      updateFile: (code: string) => void,
    }>,
  },
};
