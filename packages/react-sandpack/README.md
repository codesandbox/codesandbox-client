# React Sandpack

React components that help you create a full fledged online web application editor. Powered by Sandpack, the online bundler used by CodeSandbox.

## Getting Started

You can install this package by running `npm i --save @codesandbox/react-sandpack` or `yarn add @codesandbox/react-sandpack`.

An example implementation of this is:

```jsx
import React from 'react';
import { render } from 'react-dom';
import {
  FileExplorer,
  CodeMirror,
  BrowserPreview,
  SandpackProvider,
} from 'react-sandpack/es/components';

const files = {
  '/index.js': {
    code: "document.body.innerHTML = `<div>${require('uuid')}</div>`",
  },
};

const dependencies = {
  uuid: 'latest',
};

const App = () => (
  <SandpackProvider files={files} dependencies={dependencies} entry="/index.js">
    <div style={{ display: 'flex', width: '100%', height: '100%' }}>
      <FileExplorer style={{ width: 300 }} />
      <CodeMirror style={{ flex: 1 }} />
      <BrowserPreview style={{ flex: 1 }} />
    </div>
  </SandpackProvider>
);

render(<App />, document.getElementById('root'));
```

This renders a simple `FileExplorer`, with an editor and a preview with navigation.

### Writing a custom component

We expose the full API of Sandpack, you can access it by using a `SandpackConsumer` or the `withLive` function, both exported:

```jsx
<SandpackConsumer>
  {sandpack => {
    // Your logic!

    return <div>Hello</div>;
  }}
</SandpackConsumer>
```

The Sandpack context consists of these properties:

```ts
{
  browserFrame: HTMLIFrameElement | null;
  managerStatus: ManagerStatus;
  managerState: IManagerState | undefined;
  bundlerURL: string | undefined;
  openedPath: string;
  errors: Array<IModuleError>;
  files: IFiles;
  openFile: (path: string) => void;
  updateFiles: (files: IFiles) => void;
  getManagerTranspilerContext: () => Promise<{ [transpiler: string]: Object }>;
}
```
