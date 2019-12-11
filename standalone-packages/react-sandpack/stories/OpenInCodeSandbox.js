import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import { storiesOf, setAddon } from '@storybook/react';

import SandpackProvider from '../src/components/SandpackProvider/index.ts';
import OpenInCodeSandbox from '../src/components/OpenInCodeSandbox/index.ts';

setAddon(JSXAddon);

const stories = storiesOf('Export To CodeSandbox', module);

stories.addWithJSX('minimal', () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <OpenInCodeSandbox />
  </SandpackProvider>
));

stories.addWithJSX('with multiple files', () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: `import Hello from './Hello.js';

  document.body.innerHTML = JSON.stringify(Hello);
  `,
      },
      '/Hello.js': {
        code: `export default \`Hello from another file, here's an ID: $\{require('uuid')()}!\``,
      },
    }}
    dependencies={{
      uuid: 'latest',
    }}
  >
    <OpenInCodeSandbox />
  </SandpackProvider>
));

stories.addWithJSX('with render prop', () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <OpenInCodeSandbox
      render={() => {
        return <button type="submit">CodeSandbox is awesome!</button>;
      }}
    />
  </SandpackProvider>
));
