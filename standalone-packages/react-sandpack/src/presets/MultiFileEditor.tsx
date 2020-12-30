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
    >
      <SandpackWrapper>
        <CodeEditor
          showTabs
          style={{
            width: 600,
            overflow: 'hidden',
            fontSize: 14,
            paddingTop: 12,
            paddingBottom: 12,
            backgroundColor: '#F8F9FB',
          }}
        />

        <Preview showNavigator={showNavigator} />
      </SandpackWrapper>
    </SandpackProvider>
  );
};
