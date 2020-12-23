import React from 'react';
import { CodeViewer } from '../components/CodeViewer';
import { Preview } from '../components/Preview';
import { SandpackWrapper } from '../elements';
import { IFile, SandboxTemplate } from '../types';
import { SANDBOX_TEMPLATES } from '../utils/sandbox-templates';
import { SandpackProvider } from '../utils/sandpack-context';
import { PresetProps } from './types';

export interface CodeRunnerProps extends PresetProps {
  code?: string;
  showCode?: boolean;
}

export const CodeRunner: React.FC<CodeRunnerProps> = ({
  code,
  showCode = false,
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

  if (code) {
    const mainFileName = projectTemplate.main;
    const mainFile: IFile = {
      code,
    };

    projectTemplate.files = {
      ...projectTemplate.files,
      [mainFileName]: mainFile,
    };
  }

  return (
    <SandpackProvider
      files={projectTemplate.files}
      dependencies={projectTemplate.dependencies}
      entry={projectTemplate.entry}
      openPaths={[projectTemplate.main]}
      showOpenInCodeSandbox={false}
    >
      <SandpackWrapper>
        {showCode && <CodeViewer />}

        <Preview showNavigator={showNavigator} />
      </SandpackWrapper>
    </SandpackProvider>
  );
};
