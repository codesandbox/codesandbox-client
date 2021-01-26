import * as React from 'react';
import { IFile } from 'smooshpack';

import { Preview } from '../components/Preview';
import { SandpackLayout } from '../components/SandpackLayout';
import { getSetup } from '../templates';
import { SandpackProvider } from '../utils/sandpack-context';
import { sandpackLightTheme } from '../themes';
import { compileStitchesTheme, ThemeProvider } from '../utils/theme-context';
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
  theme?: SandpackTheme;
  customStyle?: React.CSSProperties;
}

export const SandpackRunner: React.FC<SandpackRunnerProps> = ({
  code,
  template,
  setup,
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

  const className = compileStitchesTheme(theme);

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      environment={projectSetup.environment}
    >
      <ThemeProvider value={theme}>
        <SandpackLayout style={customStyle} className={className}>
          <Preview showNavigator={showNavigator} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
