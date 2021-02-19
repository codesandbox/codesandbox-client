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

### Using the Sandpack Component

We packed all the components and the bundler inside the `<Sandpack>` component.
There's also a small stylesheet you should bring into your css pipeline.

```jsx
import { Sandpack } from 'react-smooshpack';
import 'react-smooshpack/dist/index.css';

<Sandpack />;
```

This will render a code editor and a preview component with some predefined
settings. By default, this loads up a vanilla js sandbox, with no other
framework dependency.

### Templates, Files and Custom Setup

Your `Sandpack` can start with a predefined `template`. A template is a
collection of files and dependencies, a basic starter for a project if you want.
The `react` template in this instance, has the starter files of a
_create-react-app_ project.

```jsx
<Sandpack template="react" />
```

In most of the cases, you will want to pass custom code/files to the sandpack
instance. For this, you can use the `files` prop.

The `code` you pass should be pre-formatted:

```jsx
const code = `export default function App() {
  return <h1>Hello World</h1>
}
`;

<Sandpack
  template="react"
  files={{
    '/App.js': code,
  }}
/>;
```

The `key` of each file is the _relative path_ of the file in the project folder
structure. With this in mind, you can overwrite any of the template/sandbox
files (eg: `/index.js`, `/index.css`, etc.)

With the `customSetup` prop, you can also pass instance specific `files`,
`dependencies` or specify the project `entry` file. If both `template` and
`customSetup` are provided, the two are merged, with the `customSetup` values
having higher priority. If you don't want to start from a template, you can
specify your entire sandbox structure with the `customSetup`.

```jsx
const code = `import ReactMarkdown from 'react-markdown' 

export default function App() {
  return <ReactMarkdown># Hello, *world*!</ReactMarkdown>
}`;

<Sandpack
  template="react"
  files={{
    '/App.js': code,
  }}
  customSetup={{
    dependencies: {
      'react-markdown': 'latest',
    },
    entry: '/index.js',
  }}
/>;
```

### Theming

Sandpack comes with some predefined themes:

```jsx
<Sandpack theme="sp-dark" />
```

You can also pass a _partial_ theme object that overrides properties in the
default theme

```jsx
<Sandpack
  theme={{
    palette: {
      accent: '#fc0e34',
      inactiveText: '#aaa',
    },
    syntax: {
      keyword: '#6700ff',
    },
  }}
/>
```

Or you can import an existing theme object and change it or compose your own
theme from scratch

```jsx
import { Sandpack, sandpackDarkTheme } from 'react-smooshpack';

<Sandpack
  theme={{
    ...sandpackDarkTheme,
    typography: {
      fontSize: '16px',
      bodyFont: 'Arial',
    },
  }}
/>;
```

### Customizing what is editable

By default, the `Sandpack` component shows all the files you pass through
`files`. If not files are passed and you use the `customSetup`, all project
files will be visible as tab buttons.

The `files` prop also accepts an object. When the object is used, the file
content is set with the `code` property. With this notation, additional flags
you can use to customize the sandpack experience. For example, you can pass a
`hidden` flag for files that you don't want to show to the user:

```jsx
<Sandpack
  files={{
    '/App.js': reactCode,
    '/button.js': buttonCode,
    '/link.js': {
      code: linkCode,
      hidden: true,
    },
  }}
  template="react"
/>
```

You can also specify the `active` file, which is open in the code editor
initially. If no `active` flag is set, the first file will be visible by
default:

```jsx
<Sandpack
  files={{
    '/App.js': reactCode,
    '/button.js': {
      code: buttonCode,
      active: true,
    }
    '/link.js': {
      code: linkCode,
      hidden: true,
    },
  }}
  template="react"
/>
```

You can override the entire hidden/active system with two settings inside the
`options` prop, but this requires you to set the relative paths in multiple
places and can be error prone, so use this with caution:

```jsx
<Sandpack
  template="react"
  files={{
    '/App.js': reactButtonCode,
    '/button.js': buttonCode,
  }}
  options={{
    openPaths: ['/App.js', '/button.js', '/index.js'],
    activePath: '/index.js',
  }}
/>
```

When `openPaths` or `activePath` are set, the `hidden` and `active` flags on the
`files` prop are ignored.

### Customizing the UI Elements

By default, `Sandpack` will show the file tabs if more than one file is open and
will show a small refresh button on top of the `Preview`. But you can customize
some of the parts of the component via flags set on the `options` prop.

```jsx
<Sandpack
  options={{
    showNavigator: true, // this will show a top navigator bar instead of the refresh button
    showTabs: false, // you can toggle the tabs on/off manually
    showLineNumbers: true, // this is off by default, but you can show line numbers for the editor
    wrapContent: true, // also off by default, this wraps the code instead of creating horizontal overflow
    editorWidthPercentage: 60, // by default the split is 50/50 between the editor and the preview
  }}
/>
```

You can also pass css style rules to the `customStyle` prop. This should be used
with care, because it might mess up the layout and the theming. One useful
configuration is the height of the component. We recommend **fixed heights**, to
avoid any layout shift while the bundler is running or as you type in the editor
or switch the tab. By default, the height is set to `300px`, but you can adjust
that with the `customStyle` prop:

```jsx
<Sandpack
  customStyle={{
    height: 350, // Any valid style property will be passed to the sandpack component here
  }}
/>
```

### Execution Options

By default, the bundling process will start as soon as the component is getting
closer to the viewport, or when the page loads if the component is already in
the viewport. But you can allow users to trigger the process manually.

```jsx
<Sandpack options={{ autorun: false }} template="react" />
```

When a `sandpack` instance is not set on `autorun`, which is the default
setting, it will show a _Run_ button that initializes the process.

The `options` also allow you to customize the _recompile mode_, or what happens
you type inside the code editor.

```jsx
<Sandpack options={{ recompileMode: 'immediate' }} template="react" />
```

By default, the mode is set to `delayed` and there's a `500ms` debounce timeout
that ensures the bundler doesn't run on each keystroke. You can customize this
experience by modifying the `recompileDelay` value or by setting the
`recompileMode` to `immediate`.

```jsx
<Sandpack
  options={{
    recompileMode: 'delayed',
    recompileDelay: 300,
  }}
  template="react"
/>
```

### Sandpack Runner

In all the examples above we used `Sandpack`, which, in our internal kitchen, we
call a preset. In other words, it is a fixed configuration of sandpack
components and default settings that make up an instance of _sandpack_.

In case you want to have the bundler running and you don't want the code editing
component, you can use a `SandpackRunner` preset.

The `SandpackRunner` has some of the props we already described above:
`template`, `customSetup`, `theme` and `customStyle`. They work exactly the same
on this preset.

However, your input will be sent through the `code` prop. This is a single
string that will replace the **main** file of the project.

```jsx
import { SandpackRunner } from 'react-smooshpack';

<SandpackRunner code={`...`} template="vue" />;
```

In this example, `code` will replace the `App.vue` file, because that is the
**main** file in the vue template. For `react`, this would be the `App.js` file.

## Getting deeper

Coming soon

### Build your custom Sandpack

Coming soon

### Create a custom sandpack-aware component

Coming soon

### sandpack core

Coming soon

## Development

Coming soon
