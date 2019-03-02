// @flow
import { Sandbox } from '../../types';

export type ConfigurationFile = {
  title: string;
  type: string;
  description: string;
  moreInfoUrl: string;

  getDefaultCode?: (
    template: string,
    resolveModule: (path: string) => { code: string } | undefined
  ) => string;
  generateFileFromState?: (state: any) => string;
  generateFileFromSandbox?: (sandbox: Sandbox) => string;

  schema?: string;
  partialSupportDisclaimer?: string;
};

export type ParsedConfigurationFile = {
  parsed?: any;
  code: string;
  generated: boolean;
  error?: Error;
};
