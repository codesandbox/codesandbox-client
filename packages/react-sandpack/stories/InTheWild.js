import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs } from '@storybook/addon-knobs/react';

import SandpackProvider from '../src/components/SandpackProvider/index.ts';
import SandpackConsumer from '../src/components/SandpackConsumer/index.ts';
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

      <SandpackConsumer>
        {sandpack => console.log(sandpack) || <div />}
      </SandpackConsumer>
    </div>
  </SandpackProvider>
));

stories.addWithJSX('subdirectories', () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``,
      },
      '/test/index.js': {
        code: 'module.exports = "test"',
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

stories.addWithJSX('babel', () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `import React from 'react';`,
      },
      '/.babelrc': {
        code: JSON.stringify(
          {
            presets: ['latest', 'stage-1'],
            plugins: [
              'transform-object-assign',
              'transform-decorators-legacy',
              [
                'transform-react-jsx',
                {
                  pragma: 'h',
                },
              ],
              [
                'jsx-pragmatic',
                {
                  module: 'preact',
                  export: 'h',
                  import: 'h',
                },
              ],
            ],
          },
          null,
          2
        ),
      },
    }}
    dependencies={{}}
    entry="/index.js"
    template="preact-cli"
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
