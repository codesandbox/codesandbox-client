import React from 'react';
import { SandpackWrapper } from '../elements';
import { IFiles } from '../types';
import { SandpackProvider } from '../utils/sandpack-context';
import { CodeEditor } from '../components/CodeEditor';
import { Preview } from '../components/Preview';

export interface PresetProps {
  files: IFiles;
}

export const BasicEditor: React.FC<PresetProps> = ({ files }) => (
  <SandpackProvider
    files={files}
    dependencies={{
      react: 'latest',
      'react-dom': 'latest',
      'react-refresh': 'latest',
      '@babel/runtime': 'latest',
    }}
    entry="/index.js"
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

      <Preview />
    </SandpackWrapper>
  </SandpackProvider>
);
