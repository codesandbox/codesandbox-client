# React Sandpack

React components that give you the power of editable code snippets that run in
the browser. Powered by Sandpack, the online bundler used by
[CodeSandbox](https://codesandbox.io/).

## Getting Started

You can install this package by running `npm i react-smooshpack` or
`yarn react-smooshpack`.

We create a few `presets` that have a minimal configuration API, but give you
enough flexibility and override capabilities.

### Basic Editor

If you want a single editable file, you can use the `BasicEditor` preset.

```jsx
import { BasicEditor } from 'react-smooshpack';

<BasicEditor code={`...`} template="create-react-app" />;
```

The `code` string should be pre-formatted:

```jsx
import React from 'react';
import ReactDOM from 'react-dom';
import { BasicEditor } from 'react-smooshpack';

const code = `import React from 'react';

export default function App() {
  return <h1>Hello World</h1>
}
`;

<BasicEditor code={code} template="create-react-app" />;
```

### Code Runner

In case you want to have the bundler running and you don't want the code editing
component, you can use a `CodeRunner` preset.

```jsx
import { CodeRunner } from 'react-smooshpack';

<CodeRunner code={`...`} template="vue-cli" />;
```

### Multi-File Editor

Finally, if you use case requires multi file edits, you can rely on the
`MultiFileEditor` preset, which has a different API for supplying a set of files
you want to have open in your component instance:

```jsx
import { MultiFileEditor } from 'react-smooshpack';

<MultiFileEditor
  showNavigator
  editableFiles={{
    '/App.js': { code: reactButtonCode },
    '/button.js': { code: buttonCode },
  }}
/>;
```

Each preset extends a `PresetProps` interface through which you can pass:

- template: string - a string of type `SandboxEnvironment`
- customSetup: string - specify files, dependencies and different entries for
  the bundler
- showNavigator: boolean - display the navigator bar on top of the bundled
  result
- showLineNumbers: boolean - display line numbers for the editor
- theme: SandpackTheme - a theme object, predefined or custom
- customStyle - a set of style rules that overwrite the styling of the main
  component wrapper
- bundlerURL - a custom bundlerURL, if you have a self-hosted version }

### Theming

We offer some predefined themes for `react-sandpack`:

```jsx
import { MultiFileEditor, SandpackDarkTheme } from 'react-smooshpack';

<MultiFileEditor
  showNavigator
  theme={SandpackDarkTheme}
  editableFiles={{
    '/App.js': { code: reactButtonCode },
    '/button.js': { code: buttonCode },
  }}
/>;
```

You can also customize the colors of the components and the code syntax with our
`SandpackTheme` interface.

```typescript
type SandpackTheme = {
  palette: {
    highlightText: string;
    defaultText: string;
    inactive: string;
    mainBackground: string;
    inputBackground: string;
    accent: string;
  };
  syntax: {
    plain: string;
    disabled: string;
    keyword: string;
    definition: string;
    property: string;
    tag: string;
    static: string;
  };
};
```

```jsx
import { MultiFileEditor, SandpackDarkTheme } from 'react-smooshpack';

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

<MultiFileEditor
  showNavigator
  theme={customTheme}
  editableFiles={{
    '/App.js': { code: reactButtonCode },
    '/button.js': { code: buttonCode },
  }}
/>;
```

## Getting deeper

If you don't want to use our presets, we export all the small parts that make up
`react-sandpack`:

- visual components: CodeEditor, Preview, FileTabs, Navigator, etc.
- utilities: SandpackContext, ThemeContext, etc.

### Building your preset

Coming soon

### Creating a custom sandpack-aware component

Coming soon

### Sandpack

Coming soon

## Development

Coming soon
