import { SandboxEnvironment, SandboxTemplate, SandpackTheme } from '../types';

export interface PresetProps {
  template?: SandboxEnvironment;
  customSetup?: Partial<SandboxTemplate>;
  showNavigator?: boolean;
  showLineNumbers?: boolean;
  theme?: SandpackTheme;
  customStyle?: React.CSSProperties;
  bundlerURL?: string;
}
