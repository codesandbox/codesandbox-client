import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs } from '@storybook/addon-knobs/react';

import SandpackProvider from '../src/components/SandpackProvider/index.ts';
import FileExplorer from '../src/components/FileExplorer/index.ts';
import BrowserPreview from '../src/components/BrowserPreview/index.ts';
import TranspiledCodeView from '../src/components/TranspiledCodeView/index.ts';
import CodeEditor from '../src/components/CodeEditor/CodeMirror/index.ts';

import '../dist/styles.css';

setAddon(JSXAddon);

const stories = storiesOf('InTheWild', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('one file', () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``,
      },
    }}
    dependencies={{ uuid: 'latest' }}
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
    </div>
  </SandpackProvider>
));

stories.addWithJSX('transpiled view', () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``,
      },
    }}
    dependencies={{ uuid: 'latest' }}
    entry="/index.js"
    skipEval
  >
    <div
      style={{
        display: 'flex',
        width: '100vw',
        height: '100vh',
      }}
    >
      <FileExplorer style={{ width: 300 }} />

      <CodeEditor style={{ width: '100%', overflowX: 'hidden' }} />
      <TranspiledCodeView style={{ width: '100%', overflowX: 'hidden' }} />
    </div>
  </SandpackProvider>
));
