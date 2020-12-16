import React from 'react';
import { SandpackWrapper } from '../elements';
import { IFile, SandboxTemplateType } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';
import { projectTemplates } from '../utils/project-templates';

export interface PresetProps {
  code: string;
  mainFileName?: string;
  template?: SandboxTemplateType;
  showNavigator?: boolean;
}

export const BasicEditor: React.FC<PresetProps> = ({
  code,
  mainFileName = '/App.js',
  template = 'cra',
  showNavigator = false,
}) => {
  const projectTemplate = projectTemplates[template];
  const mainFile: IFile = {
    code,
  };
  const files = {
    ...projectTemplates[template].files,
    [mainFileName]: mainFile,
  };

  return (
    <SandpackProvider
      files={files}
      dependencies={projectTemplate.dependencies}
      entry={projectTemplate.entry}
      openedPath="/App.js"
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
