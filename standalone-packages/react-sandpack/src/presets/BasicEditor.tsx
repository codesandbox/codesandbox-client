import * as React from 'react';
import { IFile } from 'smooshpack';
import { SandpackLayout } from '../components/SandpackLayout';
import { PresetProps } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../templates';
import { sandpackLightTheme } from '../themes';
import { compileStitchesTheme, ThemeProvider } from '../utils/theme-context';

export interface BasicEditorProps extends PresetProps {
  code?: string;
}

export const BasicEditor: React.FC<BasicEditorProps> = ({
  code,
  template,
  customSetup,
  previewOptions,
  codeOptions,
  bundlerOptions,
  executionOptions,
  customStyle,
  theme = sandpackLightTheme,
}) => {
  const presetPreviewOptions = {
    ...{ showOpenInCodeSandbox: false },
    ...previewOptions,
  };

  const presetCodeOptions = {
    ...{ showTabs: false },
    ...codeOptions,
  };

  const presetExecutionOptions = {
    ...{ autorun: false },
    ...executionOptions,
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
  const { height, ...otherStyles } = customStyle || {};

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      openPaths={[projectSetup.main]}
      environment={projectSetup.environment}
      showOpenInCodeSandbox={presetPreviewOptions.showOpenInCodeSandbox}
      {...bundlerOptions}
      {...presetExecutionOptions}
    >
      <ThemeProvider value={theme}>
        <SandpackLayout
          style={otherStyles}
          css={{
            '& > *': {
              height,
            },
          }}
          className={className}
        >
          <CodeEditor {...presetCodeOptions} />
          <Preview {...presetPreviewOptions} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
