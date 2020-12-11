import React from 'react';
import { OpenInCodeSandboxButton } from '../components/OpenInCodeSandboxButton';

import { SandpackProvider } from '../utils/sandpack-context';

export default {
  title: 'Open in CodeSandbox',
};

export const Minimal = () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <OpenInCodeSandboxButton />
  </SandpackProvider>
);

export const WithMultipleFiles = () => (
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
    <OpenInCodeSandboxButton />
  </SandpackProvider>
);

export const WithRenderProp = () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <OpenInCodeSandboxButton
      render={() => {
        return <button type="submit">CodeSandbox is awesome!</button>;
      }}
    />
  </SandpackProvider>
);
