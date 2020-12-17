import React from 'react';

import { FileExplorer } from '../components/FileExplorer';
import { Preview } from '../components/Preview';
import { TranspiledCodeView } from '../components/TranspiledCodeView';
import { CodeEditor } from '../components/CodeEditor';
import { SandpackConsumer, SandpackProvider } from '../utils/sandpack-context';

export default {
  title: 'presets/Custom Sandpack',
};

export const CustomEditor = () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>$\{require('uuid').v4()}</div>\``,
      },
    }}
    dependencies={{ uuid: 'latest', '@babel/runtime': 'latest' }}
    entry="/index.js"
  >
    <div style={{ display: 'flex', width: '100vw', height: '100vh' }}>
      <FileExplorer style={{ width: 300 }} />
      <CodeEditor
        style={{
          width: '33%',
          overflow: 'hidden',
        }}
      />
      <Preview
        style={{
          width: '33%',
          overflow: 'hidden',
        }}
      />
      <TranspiledCodeView
        style={{
          width: '33%',
          overflow: 'hidden',
        }}
      />

      <SandpackConsumer>
        {sandpack => {
          console.log(sandpack);
          return <div />;
        }}
      </SandpackConsumer>
    </div>
  </SandpackProvider>
);
