import * as React from 'react';
import { IFile } from 'smooshpack';

import { CodeViewer } from '../components/CodeViewer';
import { Preview } from '../components/Preview';
import { SandpackWrapper } from '../elements';
import { PresetProps } from '../types';
import { getSetup } from '../templates';
import { SandpackProvider } from '../utils/sandpack-context';
import { sandpackLightTheme } from '../themes';
import { compileStitchesTheme, ThemeProvider } from '../utils/theme-context';

export interface CodeRunnerProps extends PresetProps {
  code?: string;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({
  code,
  template,
  customSetup,
  previewOptions,
  codeOptions,
  bundlerOptions,
  customStyle,
  theme = sandpackLightTheme,
}) => {
  const presetPreviewOptions = {
    ...{ showOpenInCodeSandbox: false },
    ...previewOptions,
  };

  const presetCodeOptions = {
    ...{ showCode: false },
    ...codeOptions,
  };

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
      environment={projectSetup.environment}
      showOpenInCodeSandbox={presetPreviewOptions.showOpenInCodeSandbox}
      bundlerURL={bundlerOptions?.bundlerURL}
    >
      <ThemeProvider value={theme}>
        <SandpackWrapper style={customStyle} className={className}>
          {presetCodeOptions.showCode && <CodeViewer {...presetCodeOptions} />}

          <Preview {...presetPreviewOptions} />
        </SandpackWrapper>
      </ThemeProvider>
    </SandpackProvider>
  );
};
