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
3.  Most common transpilers (vue, babel, typescript, css, scss, less, stylus, parcel, etc...)
4.  Parallel transpiling
5.  On-demand transpiler loading
6.  Webpack loader syntax (`!raw-loader!./test.js`)
7.  Friendly error overlay (using `create-react-app` overlay)
8.  Transpilation result caching
9.  HTML/CSS entry points

## Example usage

This repo serves as an interface to communicate with the bundler. The bundler itself is hosted on `sandpack-{version}.codesandbox.io` and is heavily cached by a CDN. We also included the necessary files under `sandpack` if you want to host the bundler yourself.

### Using the Manager

The Manager is a class implementation, you can use it by importing Manager.

```js
import { Manager } from 'sandpack';

// There are two ways of initializing a preview, you can give it either an
// iframe element or a selector of an element to create an iframe on.
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
  },
  entry: '/index.js',
  dependencies: {
    uuid: 'latest',
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

```jsx harmony
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

render(<App />, document.getElementById('root'));
```

The above code will render a File Explorer, a working code editor and a preview with browser navigation. We have many more components, like a Jest test view or a console. For more info about `react-sandpack` you can go here: https://github.com/codesandbox/codesandbox-client/tree/master/standalone-packages/react-sandpack

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
   * If we should skip the third step: evaluation. Useful if you only want to see
   * transpiled results
   */
  skipEval?: boolean;
}
```

### Manager functions

The manager instance has several helper functions you can call.

#### `updatePreview`

Send new sandbox info, like files and dependencies, to the preview. It will automatically hot update the preview with the new files and options. Accepts a single argument `sandboxInfo` of type `SandboxInfo`.

#### `updateOptions`

Updates the given options and updates the preview. Accepts a single argument `options` of type `Options`.

#### `dispatch`

Dispatch an event to the sandbox preview and all other listeners. Accepts a single argument, which is the data to send. This is used heavily by the manager and `react-sandpack` to communicate with the bundler.

#### `getCodeSandboxURL`

Create a sandbox from the current files and return an object in this form:

```js
{
  sandboxId: sandbox_id,
  editorUrl: `https://codesandbox.io/s/${sandbox_id}`,
  embedUrl: `https://codesandbox.io/embed/${sandbox_id}`,
}
```

## Why is the bundler hosted externally and not a simple `import`?

We have three reasons to host the bundler of sandpack externally:

### Security

The bundler evaluates and transpiles all files in an iframe under a different subdomain. This is important, because it prevents attackers from tampering with cookies of the host domain when evaluating code.

### Performance

We heavily make use of Web Workers for transpilations. Almost all our transpilation happens in web workers, and there is no easy way yet to bundle this in a library.

### Bundle Size

Another reason to host the bundler externally is because of code splitting: we split all our transpilers away and load them on-demand. If a user doesn't use `sass` we won't load the transpiler. This wouldn't be possible if we would give one big JS file as the library.

### Offline Support

We use Service Workers to download all transpilers in the background, so the next time a user visits your website they don't have to download the bundler anymore and it can be used offline. This is possible because we host the service worker externally.

> I want to highlight that you can also host the bundler by yourself, all necessary files are in the `sandpack` folder.

## Open In CodeSandbox

We show an "Open in CodeSandbox" button in the sandbox preview on the bottom right. This button allows everyone to create a sandbox from the code in the preview, open it in CodeSandbox and share their work more easily with others.
