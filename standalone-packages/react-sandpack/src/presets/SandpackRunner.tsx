import * as React from 'react';
import { IFile } from 'smooshpack';

import { Preview } from '../components/Preview';
import { SandpackLayout } from '../components/SandpackLayout';
import { getSetup } from '../templates';
import { SandpackProvider } from '../contexts/sandpack-context';
import { sandpackLightTheme } from '../themes';
import { ThemeProvider } from '../contexts/theme-context';
import {
  SandboxTemplate,
  SandpackPredefinedTemplate,
  SandpackTheme,
} from '../types';

export interface SandpackRunnerProps {
  code?: string;
  template?: SandpackPredefinedTemplate;
  setup?: Partial<SandboxTemplate>;
  showNavigator?: boolean;
  showOpenInCodeSandbox?: boolean;
  bundlerUrl?: string;
  theme?: SandpackTheme;
  customStyle?: React.CSSProperties;
}

export const SandpackRunner: React.FC<SandpackRunnerProps> = ({
  code,
  template,
  setup,
  bundlerUrl,
  showNavigator = false,
  theme = sandpackLightTheme,
  customStyle,
}) => {
  const projectSetup = getSetup(template, setup);

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
      bundlerURL={bundlerUrl}
    >
      <ThemeProvider value={theme}>
        <SandpackLayout style={customStyle}>
          <Preview showNavigator={showNavigator} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
