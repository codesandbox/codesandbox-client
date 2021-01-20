# React Sandpack

React components that give you the power of editable sandboxes that run in the
browser. Powered by `Sandpack`, the online bundler used by
[CodeSandbox](https://codesandbox.io/).

Sandpack is an open ecoystem of components and utilities that allow you to
compile and run modern frameworks in the browser. You can either use one of our
predefined `components` for embedding the _CodeSandbox_ experience into your
projects, or you can build your own version of `sandpack`, on top of our
standard components and utilities. As you walk through this guide, you will get
deeper into our ecosystem.

## Getting Started

You can install this package by running `npm i react-smooshpack` or
`yarn react-smooshpack`.

The package contains multiple components, utilities and typings for diving into
the `sandpack` ecosystem.

### Using the Sandpack component

We packed all the components and the bundler inside the `<Sandpack>` component.

```tsx
import { Sandpack } from 'react-smooshpack';

<Sandpack />;
```

This will render a code editor and a preview component with some predefined
settings. By default, this loads up a vanilla js sandbox, with no other
framework dependency.

### Templates, files and dependencies

Your `Sandpack` can start with a predefined `template`. A template is a
collection of files and dependencies, a basic starter for a project if you want.

```tsx
<Sandpack template="react" />
```

In most of the cases, you will want to pass custom code/files to the sandpack
instance. For this, you can use the `setup` prop. If both `template` and `setup`
are provided, the two are merged, with the `setup` values having higher
priority.

The `code` you pass should be pre-formatted:

```tsx
import React from 'react';
import ReactDOM from 'react-dom';
import { Sandpack } from 'react-smooshpack';

const code = `import React from 'react';

export default function App() {
  return <h1>Hello World</h1>
}
`;

<Sandpack
  template="react"
  setup={{
    files: {
      '/App.js': code,
    },
  }}
/>;
```

Code files are passed as raw strings, with the file path relative to the root of
the project being the file key. With the `setup` prop, you can also pass custom
`dependencies` and specify the project `entry` file, used by the bundler as an
entry point and the `main` file, that is the default active file tab.

```tsx
const reactWithLibCode = `import React from 'react';
import ReactMarkdown from 'react-markdown' 

export default function App() {
  return <ReactMarkdown># Hello, *world*!</ReactMarkdown>
}`;

<Sandpack
  template="react"
  setup={{
    files: {
      '/App.js': reactWithLibCode,
    },
    dependencies: {
      'react-markdown': 'latest',
    },
  }}
/>;
```

### Theming

We offer some predefined themes for `react-sandpack`:

```tsx
import { Sandpack, sandpackDarkTheme } from 'react-smooshpack';

<Sandpack theme={sandpackDarkTheme} />;
```

You can also customize the colors of the components and the code syntax with our
`SandpackTheme` interface.

```jsx
import { Sandpack } from 'react-smooshpack';

// Emulate NightOwl
const customTheme = {
  palette: {
    highlightText: 'rgb(197, 228, 253)',
    defaultText: 'rgb(95, 126, 151)',
    inactive: 'rgb(58, 62, 77)',
    mainBackground: 'rgb(1, 22, 39)',
    inputBackground: 'rgb(11, 41, 66)',
    accent: '#7fdbca',
  },
  syntax: {
    plain: '#d6deeb',
    disabled: '#999999',
    keyword: '#c792ea',
    tag: '#7fdbca',
    definition: '#A23DAD',
    property: '#addb67',
    static: '#ecc48d',
  },
}

<Sandpack theme={customTheme} />;
```

### Customizing the UI

By default, the `Sandpack` component shows all the files you pass through
`setup`. You can customize which files to be shown as tabs via the `openPaths`
prop. This prop takes an array of file paths, again relative to the root of the
project.

```tsx
<Sandpack
  template="react"
  openPaths={['/App.js', '/button.js', '/index.js']}
  setup={{
    files: {
      '/App.js': reactButtonCode,
      '/button.js': buttonCode,
    },
  }}
/>
```

In this case, `index.js`, coming from the template as the entry file for `React`
should also be editable. You can also specify which tab is active when the
component mounts with the `activePath` prop. This defaults to the project `main`
file.

```tsx
<Sandpack
  template="react"
  activePath="/button.js"
  setup={{
    files: {
      '/App.js': reactButtonCode,
      '/button.js': buttonCode,
    },
  }}
/>
```

Finally, there are two set of option props for customizing the code and the
preview: `codeOptions` and `previewOptions`. With these props you can show/hide
different subparts of the main components of `Sandpack`.

```tsx
<Sandpack
  previewOptions={{ showNavigator: false }}
  codeOptions={{ showTabs: false, showLineNumbers: true }}
  template="react"
/>
```

### Custom styling

coming soon

### Execution Options

By default, the bundling process will start as soon as the component mounts. But
you can allow users to trigger the process manually.

```tsx
<Sandpack executionOptions={{ autorun: false }} template="react" />
```

When a `sandpack` instance is not set on `autorun`, which is the default
setting, it will show a `run` button that initializes the process. This scenario
is useful for optimizing the performance on pages that contain several instances
of `sandpack`.

The execution options also allow you to customize the recompile mode, or what
happens you type inside the code editor.

```tsx
<Sandpack
  executionOptions={{ autorun: false, recompileMode: 'immediate' }}
  template="react"
/>
```

By default, the mode is set to `delayed` and there's a `500ms` _debounce_
timeout that ensures the bundler doesn't run on each keystroke. You can
customize this experience by modifying the `recompileDelay` value or by setting
the `recompileMode` to `immediate`.

```tsx
<Sandpack
  executionOptions={{
    autorun: false,
    recompileMode: 'delayed',
    recompileDelay: 300,
  }}
  template="react"
/>
```

### Bundler Options

Coming soon

### Sandpack Runner

In all the examples above we used `Sandpack`, which, in our internal kitchen, we
call a preset. In other words, it is a fixed configuration of sandpack
components and default settings that make up an instance of sandpack.

In case you want to have the bundler running and you don't want the code editing
component, you can use a `SandpackRunner` preset.

```jsx
import { SandpackRunner } from 'react-smooshpack';

<SandpackRunner code={`...`} template="vue" />;
```

## Getting deeper

If you don't want to use our presets, we export all the small parts that make up
`react-sandpack`:

- visual components: CodeEditor, Preview, FileTabs, Navigator, etc.
- utilities: SandpackContext, ThemeContext, etc.

### Build your custom Sandpack

Coming soon

### Create a custom sandpack-aware component

Coming soon

### sandpack core

Coming soon

## Development

Coming soon
