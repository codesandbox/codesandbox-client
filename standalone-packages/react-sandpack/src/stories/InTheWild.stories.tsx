import React from 'react';

import SandpackProvider from '../components/SandpackProvider';
import SandpackConsumer from '../components/SandpackConsumer';
import FileExplorer from '../components/FileExplorer';
import BrowserPreview from '../components/BrowserPreview';
import TranspiledCodeView from '../components/TranspiledCodeView';
import CodeEditor from '../components/CodeEditor/CodeMirror';
import { CodeMirrorNext } from '../components/CodeEditor/CodeMirror/CodeMirrorNext';
import { Navigator, Preview } from '../components';
import { BasicEditor } from '../presets/BasicEditor';

export default {
  title: 'In the Wild',
};

export const OneFile = () => (
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
      <BrowserPreview
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

const files = {
  '/App.js': {
    code: `import React from 'react';

export default function App() {
  return <h1>Hello World</h1>
}
`,
  },
  '/index.js': {
    code: `import { render } from 'react-dom';
import React from 'react';
import App from './App.js';
import './styles.css';

render(<App />, document.getElementById('root'))`,
  },
  '/styles.css': {
    code: `body {
font-family: sans-serif;
-webkit-font-smoothing: auto;
-moz-font-smoothing: auto;
-moz-osx-font-smoothing: grayscale;
font-smoothing: auto;
text-rendering: optimizeLegibility;
font-smooth: always;
-webkit-tap-highlight-color: transparent;
-webkit-touch-callout: none;
}

h1 {
font-size: 1.5rem;
}`,
  },
  '/public/index.html': {
    code: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <div id="root"></div>
    </body>
    </html>`,
  },
};

export const NewEditor = () => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
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
      showOpenInCodeSandbox={true}
    >
      <div
        style={{
          border: '1px solid #EBEDF0',
          borderRadius: 4,
          overflow: 'hidden',
        }}
      >
        <FileExplorer style={{ width: 600 }} />
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

        <Navigator />
        <Preview />
        <TranspiledCodeView
          style={{
            width: 600,
            height: 200,
          }}
        />
      </div>
    </SandpackProvider>
  </div>
);

export const MultipleInstances = () => (
  <div
    style={{
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexDirection: 'column',
    }}
  >
    <BasicEditor files={files} />
    <BasicEditor files={files} />
    <BasicEditor files={files} />
  </div>
);
