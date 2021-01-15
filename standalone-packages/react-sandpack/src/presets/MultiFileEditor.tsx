import * as React from 'react';
import { IFiles } from 'smooshpack';
import { SandpackLayout } from '../components/SandpackLayout';
import { PresetProps } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../templates';
import { sandpackLightTheme } from '../themes';
import { ThemeProvider, compileStitchesTheme } from '../utils/theme-context';

export interface MultiFileEditorProps extends PresetProps {
  editableFiles: IFiles | string[];
}

export const MultiFileEditor: React.FC<MultiFileEditorProps> = ({
  editableFiles = [],
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
    ...{ showOpenInCodeSandbox: false, showNavigator: true },
    ...previewOptions,
  };

  const presetCodeOptions = {
    ...{ showTabs: true },
    ...codeOptions,
  };

  const presetExecutionOptions = {
    ...{ autorun: true },
    ...executionOptions,
  };

  const projectSetup = getSetup(template, customSetup);
  let openPaths: string[] = [];

  // If array is passed, set the open paths
  // If array is empty, open all project files
  if (Array.isArray(editableFiles)) {
    const validPaths = editableFiles.filter(
      filePath => !!projectSetup.files[filePath]
    );
    openPaths =
      validPaths.length > 0 ? validPaths : Object.keys(projectSetup.files);
  } else {
    // If object is passed, add the editable files to the project setup and open them exclusively
    projectSetup.files = {
      ...projectSetup.files,
      ...editableFiles,
    };

    openPaths = Object.keys(editableFiles);
  }

  const className = compileStitchesTheme(theme);

  return (
    <SandpackProvider
      files={projectSetup.files}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      openPaths={openPaths}
      activePath={projectSetup.main}
      environment={projectSetup.environment}
      showOpenInCodeSandbox={presetPreviewOptions.showOpenInCodeSandbox}
      {...presetExecutionOptions}
      {...bundlerOptions}
    >
      <ThemeProvider value={theme}>
        <SandpackLayout style={customStyle} className={className}>
          <CodeEditor {...presetCodeOptions} />
          <Preview {...presetPreviewOptions} />
        </SandpackLayout>
      </ThemeProvider>
    </SandpackProvider>
  );
};
