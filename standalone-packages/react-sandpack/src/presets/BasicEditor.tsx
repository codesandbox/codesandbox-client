import React from 'react';
import { Preview, SandpackProvider } from '../components';
import { CodeMirrorNext } from '../components/CodeEditor/CodeMirror/CodeMirrorNext';
import { SandpackWrapper } from '../elements';
import { IFiles } from '../types';

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
      <CodeMirrorNext
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
