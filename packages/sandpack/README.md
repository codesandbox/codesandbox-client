# Sandpack

A bundler that completely works in the browser and takes advantage of it.

## Why?

Online code playgrounds are getting more popular: they provide an easy way to play with code without installation. Until a year ago it was very hard to play with bigger web applications in the browser; there was no bundler that was comparable with local bundlers and worked in the browser.

CodeSandbox came along, and still had a pretty basic bundler. However, as CodeSandbox got more popular its bundler got more advanced. Nowadays the bundler is used for all kinds of bigger web projects, and it would be a shame if others couldn't use the functionality.

This library acts as an interface with the bundler of CodeSandbox. It allows you to run any code on a web page, from Vue projects to React projects to Parcel projects. With everything that CodeSandbox supports client side as well.

## So what can this bundler do?

This is a list of features that the bundler supports out of the box, the list may be outdated.

1.  Hot Module Reloading API (`module.hot`)
2.  npm dependencies
3.  Most common transpilers (vue, babel, typescript, css, etc...)
4.  Parallel transpiling
5.  On-demand transpiler loading
6.  Webpack loader syntax (`!raw-loader!./test.js`)
7.  Friendly error overlay (using `create-react-app` overlay)
8.  Transpilation result caching

## Example usage

This repo serves as an interface to communicate with the bundler. The bundler itself is hosted on `sandpack-{version}.codesandbox.io` and is heavily cached by a CDN. We also included the necessary files under `bundler` if you want to host the bundler yourself.

### Using the Manager

The Manager is a class implementation, you can use it by importing Manager.

```js
import { Manager } from 'sandpack';

// There are two ways of initializing a preview, you can give it either an iframe element or a selector of an element to create an iframe on.
const manager = new Manager(
  '#preview',
  {
    files: {
      '/index.js': {
        code: `console.log(require('uuid'))`,
      },
    },
    entry: '/index.js',
    dependencies: {
      uuid: 'latest',
    },
  } /* We support a third parameter for advanced options, you can find more info in the bottom */
);

// When you make a change you can just run `updatePreview`, we'll automatically discover
// which files have changed and hot reload them.
manager.updatePreview({
  files: {
    '/index.js': {
      code: `console.log('New Text!')`,
    },
    entry: '/index.js',
    dependencies: {
      uuid: 'latest',
    },
  },
});
```

If you specify a `package.json` in the list of files we will use that as source of truth instead, we infer `dependencies` and `entry` from it:

```js
// We infer dependencies and the entry point from package.json
const PACKAGE_JSON_CODE = JSON.stringify(
  {
    title: 'test',
    main: 'index.js',
    dependencies: {
      uuid: 'latest',
    },
  },
  null,
  2
);

// Give it either a selector or an iframe element as first argument, the second arguments are the files
const manager = new Manager('#preview', {
  files: {
    '/index.js': {
      code: `console.log(require('uuid'))`,
    },
    '/package.json': {
      code: PACKAGE_JSON_CODE,
    },
  },
});
```

### As a React Component

We built another library called `react-sandpack` for usage with `sandpack`. This library provides basic React components for editors, including `FileExplorer`, `CodeEditor` and `BrowserPreview`. This serves as a library that makes it easier to build embeddable or full blown online code editors.

An example implementation:

```jsx
import React from 'react';
import { render } from 'react-dom';
import {
  FileExplorer,
  CodeMirror,
  BrowserPreview,
  SandpackProvider,
} from 'react-sandpack';

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
```

The above code will render a File Explorer, a working code editor and a preview with browser navigation. We have many more components, like a Jest test view or a console. For more info about `react-sandpack` you can go here: https://github.com/CompuIves/codesandbox-client/tree/master/packages/react-sandpack.

> It would be really cool if we would have more libraries that uses this library as a basis. Like `vue-sandpack` and `angular-sandpack`. Or even a library that just exposes components that use `sandpack`.

### SandboxInfo Argument

The second argument in the constructor of `Manager` is all sandbox info. It has this structure:

```ts
{
  /**
   * Files, keys are paths.
  **/
  files: {
    [path: string]: {
      code: string
    }
  },
  /**
   * Dependencies, supports npm and GitHub dependencies
  **/
  dependencies?: {
    [dependencyName: string]: string
  },
  /**
   * Default file to evaluate
  **/
  entry?: string,
  /**
   * The sandbox template to use, this is inferred from the files and package.json if not specified
  **/
  template?: string
}
```

### Options Argument

The third argument in the constructor of `Manager` is extra options. It has this structure:

```ts
{
  /**
   * Location of the bundler. Defaults to `sandpack-${version}.codesandbox.io`
   */
  bundlerURL?: string;
  /**
   * Width of iframe.
   */
  width?: string;
  /**
   * Height of iframe.
   */
  height?: string;
  /**
   * If we should skip the third step: evaluation.
   */
  skipEval?: boolean;
}
```

## Open In CodeSandbox

We show a "Open in CodeSandbox" button in the sandbox preview on the bottom right. This button allows everyone to create a sandbox from the code in the preview, open it in CodeSandbox and share their work more easily with others.
