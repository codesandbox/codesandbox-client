import * as React from 'react';
import { CodeViewer } from '../components/CodeViewer';
import { Preview } from '../components/Preview';
import { SandpackWrapper } from '../elements';
import { IFile } from '../types';
import { getSetup } from '../utils/sandbox-templates';
import { SandpackProvider } from '../utils/sandpack-context';
import { PresetProps } from './types';
import { SandpackLightTheme } from '../themes';
import { compileStitchesTheme, ThemeProvider } from '../utils/theme-context';

export interface CodeRunnerProps extends PresetProps {
  code?: string;
  showCode?: boolean;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({
  code,
  showCode = false,
  template = 'create-react-app',
  customSetup,
  showNavigator = false,
  showLineNumbers = false,
  customStyle,
  bundlerURL,
  theme = SandpackLightTheme,
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

  const className = compileStitchesTheme(theme);

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      openPaths={[projectSetup.main]}
      showOpenInCodeSandbox={false}
      bundlerURL={bundlerURL}
    >
      <ThemeProvider value={theme}>
        <SandpackWrapper style={customStyle} className={className}>
          {showCode && <CodeViewer showLineNumbers={showLineNumbers} />}

          <Preview showNavigator={showNavigator} />
        </SandpackWrapper>
      </ThemeProvider>
    </SandpackProvider>
  );
};
