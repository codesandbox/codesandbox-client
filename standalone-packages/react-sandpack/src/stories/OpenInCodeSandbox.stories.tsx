import React from 'react';

import SandpackProvider from '../components/SandpackProvider';
import OpenInCodeSandbox from '../components/OpenInCodeSandbox';

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
    <OpenInCodeSandbox />
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
    <OpenInCodeSandbox />
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
    <OpenInCodeSandbox
      render={() => {
        return <button type="submit">CodeSandbox is awesome!</button>;
      }}
    />
  </SandpackProvider>
);
