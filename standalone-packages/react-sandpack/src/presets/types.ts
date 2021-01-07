import { SandboxEnvironment, SandboxTemplate } from '../types';

export interface SandpackTheme {
  // colors
  // typography
  // syntax
}

export interface PresetProps {
  template?: SandboxEnvironment;
  customSetup?: Partial<SandboxTemplate>;
  showNavigator?: boolean;
  showLineNumbers?: boolean;
  theme?: 'light' | 'dark';
  customStyle?: React.CSSProperties;
}
