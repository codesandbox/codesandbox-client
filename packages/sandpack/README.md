# Sandpack

A bundler that completely works in the browser, utilizing browser APIs.

## Why?

Online code playgrounds are getting more popular: they provide an easy way to play with code without installation. Until a year ago it was very hard to play with bigger web applications in the browser; there was no bundler that was comparable with local bundlers and worked in the browser.

CodeSandbox came along, and still had a pretty basic bundler. However, as CodeSandbox got more popular its bundler got more advanced. Nowadays the bundler has comparable feature parity with Webpack, and it would be a shame if others couldn't use the functionality.

This library acts as an interface with the bundler of CodeSandbox. It allows you to run any code on a web page, from Vue projects to React projects. With everything that CodeSandbox supports as well.

## So what can the bundler do?

This is a list of features that the bundler supports, the list may be outdated.

1. Hot Module Reloading API (`module.hot`)
2. npm dependencies
3. Supports most common transpilers (vue, babel, typescript, css)
4. Friendly error overlay
5. Parallel transpiling
6. On-demand transpiler loading

## Example usage

There are multiple ways to use the bundler. We provided two ways, but we're open to PRs to extend ways to use this!

### Using the Manager

The Manager is a plain JavaScript implementation, you can use it by importing Manager.

```js
import { Manager } from 'codesandbox-playground';

// Let's say you want to show the preview on #preview
const m = new Manager(
  '#preview',
  {
    files: {
      '/index.js': {
        code: `console.log(require('uuid'))`,
      },
    },
    dependencies: {
      uuid: 'latest',
    },
    entry: '/index.js',
  } /* you can give a third argument with extra options, described at the bottom */
);

// This will show the preview on the #preview element, you can now send new code
// by calling 'sendCode(files, dependencies, entry)'. We will automatically determine
// how to hot update the preview.
m.sendCode(
  {
    '/index.js': {
      code: `console.log('other code')`,
    },
  },
  {
    uuid: 'latest',
  },
  '/index.js'
);
```

### As a React Component

We included a React component you can use, the implementation is fairly simple.

```jsx
import Preview from 'codesandbox-playground/dist/components/Preview';

const files = {
  '/index.js': {
    code: `
    console.log('hey')
  `,
  },
};

const dependencies = {
  react: 'latest',
};

export default () => <Preview files={files} dependencies={dependencies} entry="/index.js" />;
```

We will automatically hot update the preview as the props update.
