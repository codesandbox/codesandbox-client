import { SandboxEnvironment, SandboxTemplate } from '../types';

export interface PresetProps {
  template?: SandboxEnvironment;
  customSetup?: Partial<SandboxTemplate>;
  showNavigator?: boolean;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
}
