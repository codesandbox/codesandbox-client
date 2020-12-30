import React from 'react';
import { SandpackWrapper } from '../elements';
import { IFile } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { getSetup } from '../utils/sandbox-templates';
import { PresetProps } from './types';

export interface BasicEditorProps extends PresetProps {
  code: string;
}

export const BasicEditor: React.FC<BasicEditorProps> = ({
  code,
  template = 'create-react-app',
  customSetup,
  showNavigator = false,
}) => {
  const projectSetup = getSetup(template, customSetup);

  // Replace the code in the main file
  const mainFileName = projectSetup.main;
  const mainFile: IFile = {
    code,
  };

  return (
    <SandpackProvider
      files={{
        ...projectSetup.files,
        [mainFileName]: mainFile,
      }}
      dependencies={projectSetup.dependencies}
      entry={projectSetup.entry}
      openPaths={[projectSetup.main]}
    >
      <SandpackWrapper>
        <CodeEditor
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
