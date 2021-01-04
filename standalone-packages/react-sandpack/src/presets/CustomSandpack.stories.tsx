import React from 'react';

import { FileExplorer } from '../components/FileExplorer';
import { Preview } from '../components/Preview';
import { CodeEditor } from '../components/CodeEditor';
import { SandpackProvider } from '../utils/sandpack-context';
import { SandpackWrapper } from '../elements';

export default {
  title: 'presets/Custom Sandpack',
};

export const CustomEditor = () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>This is a test</div>\``,
      },
      '/src/test.jsx': {
        code: 'console.log("Hello")',
      },
      '/src/rest.js': {
        code: 'console.log("Rest")',
      },
    }}
    dependencies={{}}
    openPaths={['/index.js']}
    entry="/index.js"
  >
    <SandpackWrapper style={{ display: 'flex' }}>
      <FileExplorer style={{ width: 300 }} />
      <div style={{ flex: 1 }}>
        <CodeEditor
          style={{
            width: '100%',
            minHeight: '100px',
          }}
          showTabs
        />

        <Preview
          style={{
            width: '100%',
            height: '100px',
          }}
        />
      </div>
    </SandpackWrapper>
  </SandpackProvider>
);
