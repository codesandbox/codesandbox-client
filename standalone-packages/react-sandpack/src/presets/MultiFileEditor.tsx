import * as React from 'react';
import { IFiles } from 'smooshpack';
import { SandpackWrapper } from '../elements';
import { PresetProps } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../templates';
import { SandpackLightTheme } from '../themes';
import { ThemeProvider, compileStitchesTheme } from '../utils/theme-context';

export interface MultiFileEditorProps extends PresetProps {
  editableFiles: IFiles;
}

export const MultiFileEditor: React.FC<MultiFileEditorProps> = ({
  editableFiles,
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
    ...{ showTabs: true },
    ...codeOptions,
  };

  const projectSetup = getSetup(template, customSetup);

  projectSetup.files = {
    ...projectSetup.files,
    ...editableFiles,
  };

  const className = compileStitchesTheme(theme);

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      openPaths={Object.keys(editableFiles)}
      activePath={projectSetup.main}
      bundlerURL={bundlerOptions?.bundlerURL}
      showOpenInCodeSandbox={presetPreviewOptions.showOpenInCodeSandbox}
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
