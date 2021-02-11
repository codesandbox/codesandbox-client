import * as React from 'react';
import { IFile } from 'smooshpack';

import { Preview } from '../components/Preview';
import { SandpackLayout } from '../components/SandpackLayout';
import { getSetup } from '../templates';
import { SandpackProvider } from '../contexts/sandpack-context';
import { sandpackLightTheme } from '../themes';
import { ThemeProvider } from '../contexts/theme-context';
import {
  SandpackPredefinedTemplate,
  SandpackSetup,
  SandpackTheme,
} from '../types';

export interface SandpackRunnerProps {
  code?: string;
  template?: SandpackPredefinedTemplate;
  customSetup?: SandpackSetup;
  theme?: SandpackTheme;
  customStyle?: React.CSSProperties;
  options?: {
    showNavigator?: boolean;
    bundlerUrl?: string;
  };
}

export const SandpackRunner: React.FC<SandpackRunnerProps> = ({
  code,
  template,
  customSetup,
  options,
  theme = sandpackLightTheme,
  customStyle,
}) => {
  const projectSetup = getSetup(template, customSetup);

  if (code) {
    const mainFileName = projectSetup.main;
    const mainFile: IFile = {
      code,
    };

    projectSetup.files = {
      ...projectSetup.files,
      [mainFileName]: mainFile,
    };
  }

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      environment={projectSetup.environment}
      bundlerURL={options?.bundlerUrl}
    >
      <ThemeProvider value={theme}>
        <SandpackLayout style={customStyle}>
          <Preview showNavigator={options?.showNavigator} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
