import React from 'react';

import { storiesOf, setAddon } from '@storybook/react';
import JSXAddon from 'storybook-addon-jsx';
import { withKnobs, text, object } from '@storybook/addon-knobs/react';

import SandpackProvider from '../src/components/SandpackProvider/index.ts';
import FileExplorer from '../src/components/FileExplorer/index.ts';
import BrowserPreview from '../src/components/BrowserPreview/index.ts';
import CodeEditor from '../src/components/CodeEditor/CodeMirror/index.ts';

import '../dist/styles.css';

setAddon(JSXAddon);

const stories = storiesOf('InTheWild', module);

stories.addDecorator(withKnobs);

stories.addWithJSX('with one file', () => (
  <SandpackProvider
    files={{
      '/index.js': {
        code: text(
          'code',
          `document.body.innerHTML = \`<div>$\{require('uuid')()}</div>\``
        ),
      },
    }}
    dependencies={object('dependencies', {
      uuid: 'latest',
    })}
    entry="/index.js"
  >
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <FileExplorer style={{ width: 300 }} />
      <CodeEditor style={{ flex: 1, height: '100%' }} />
      <BrowserPreview style={{ flex: 1, height: '100%' }} />
    </div>
  </SandpackProvider>
));
