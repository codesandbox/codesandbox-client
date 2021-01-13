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
  showNavigator = false,
  showLineNumbers = false,
  customStyle,
  bundlerURL,
  theme = SandpackLightTheme,
}) => {
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
      bundlerURL={bundlerURL}
      showOpenInCodeSandbox={false}
    >
      <ThemeProvider value={theme}>
        <SandpackWrapper style={customStyle} className={className}>
          <CodeEditor showTabs showLineNumbers={showLineNumbers} />
          <Preview showNavigator={showNavigator} />
        </SandpackWrapper>
      </ThemeProvider>
    </SandpackProvider>
  );
};
