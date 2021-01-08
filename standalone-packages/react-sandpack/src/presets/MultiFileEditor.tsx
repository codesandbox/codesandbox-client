import React from 'react';
import { SandpackWrapper } from '../elements';
import { IFiles } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../utils/sandbox-templates';
import { PresetProps } from './types';

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
}) => {
  const projectSetup = getSetup(template, customSetup);

  projectSetup.files = {
    ...projectSetup.files,
    ...editableFiles,
  };

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
      <SandpackWrapper style={customStyle}>
        <CodeEditor showTabs showLineNumbers={showLineNumbers} />
        <Preview showNavigator={showNavigator} />
      </SandpackWrapper>
    </SandpackProvider>
  );
};
