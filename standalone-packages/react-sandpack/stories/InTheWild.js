import React from 'react';

import { listen } from 'codesandbox-api';

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

listen(console.log);

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

stories.addWithJSX('custom bundler url', () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``,
      },
    }}
    dependencies={{ uuid: 'latest' }}
    entry="/index.js"
    bundlerURL="https://sandpack.ives.now.sh"
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
    bundlerURL="http://localhost:3002"
    fileResolver={{
      isFile: p => p === '/hello.js',
      readFile: p => `export default 'hello'`,
    }}
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
            plugins: [],
            presets: [
              'typescript',
              [
                '@babel/preset-env',
                {
                  targets: {},
                  forceAllTransforms: false,
                  shippedProposals: false,
                  useBuiltIns: false,
                },
              ],
            ],
            sourceMaps: false,
          },
          null,
          2
        ),
      },
      '/babel-transpiler.json': {
        code: JSON.stringify({
          babelURL:
            'https://7358-24560307-gh.circle-artifacts.com/0/home/circleci/babel/packages/babel-standalone/babel.js',
        }),
      },
    }}
    dependencies={{
      '@babel/preset-env': 'latest',
    }}
    entry="/index.js"
    template="babel-repl"
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
