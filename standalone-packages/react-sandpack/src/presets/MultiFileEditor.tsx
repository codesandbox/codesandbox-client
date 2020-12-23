import React from 'react';
import { SandpackWrapper } from '../elements';
import { IFiles, SandboxTemplate } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { SANDBOX_TEMPLATES } from '../utils/sandbox-templates';
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
  const baseTemplate = SANDBOX_TEMPLATES[template] as SandboxTemplate;
  let projectTemplate = baseTemplate;

  if (customSetup) {
    projectTemplate = {
      files: { ...baseTemplate.files, ...customSetup.files },
      dependencies: {
        ...baseTemplate.dependencies,
        ...customSetup.dependencies,
      },
      entry: customSetup.entry || baseTemplate.entry,
      main: customSetup.main || baseTemplate.main,
    };
  }

  projectTemplate.files = {
    ...projectTemplate.files,
    ...editableFiles,
  };

  return (
    <SandpackProvider
      files={projectTemplate.files}
      dependencies={projectTemplate.dependencies}
      entry={projectTemplate.entry}
      openPaths={Object.keys(editableFiles)}
      activePath={projectTemplate.main}
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
