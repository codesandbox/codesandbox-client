import * as React from 'react';
import { IFile } from 'smooshpack';
import { SandpackWrapper } from '../elements';
import { PresetProps } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../templates';
import { SandpackLightTheme } from '../themes';
import { compileStitchesTheme, ThemeProvider } from '../utils/theme-context';

export interface BasicEditorProps extends PresetProps {
  code?: string;
}

export const BasicEditor: React.FC<BasicEditorProps> = ({
  code,
  template = 'create-react-app',
  customSetup,
  previewOptions,
  codeOptions,
  bundlerOptions,
  customStyle,
  theme = SandpackLightTheme,
}) => {
  const presetPreviewOptions = {
    ...{ showOpenInCodeSandbox: false },
    ...previewOptions,
  };

  const presetCodeOptions = {
    ...{ showTabs: false },
    ...codeOptions,
  };

  const projectSetup = getSetup(template, customSetup);

  // Replace the code in the main file
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
      showOpenInCodeSandbox={presetPreviewOptions.showOpenInCodeSandbox}
      bundlerURL={bundlerOptions?.bundlerURL}
    >
      <ThemeProvider value={theme}>
        <SandpackWrapper style={customStyle} className={className}>
          <CodeEditor {...presetCodeOptions} />
          <Preview {...presetPreviewOptions} />
        </SandpackWrapper>
      </ThemeProvider>
    </SandpackProvider>
  );
};
