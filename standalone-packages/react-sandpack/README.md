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
`yarn add react-smooshpack`.

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
<Sandpack theme="codesandbox-dark" />
<Sandpack theme="codesandbox-light" />
<Sandpack theme="night-owl" />
<Sandpack theme="monokai-pro" />
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
import { Sandpack, codesandboxDarkTheme } from 'react-smooshpack';

<Sandpack
  theme={{
    ...codesandboxDarkTheme,
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

One useful configuration is the height of the component. We recommend **fixed
heights**, to avoid any layout shift while the bundler is running or as you type
in the editor or switch the tab. By default, the height is set to `300px`, but
you can adjust that with the `options.editorHeight` prop:

```jsx
<Sandpack
  options={{
    editorHeight: 350,
  }}
/>
```

Furthermore, we implemented our css classes with a handy utility package called
`classer`.

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
`template`, `customSetup` and `theme`. They work exactly the same on this
preset.

However, your input will be sent through the `code` prop. This is a single
string that will replace the **main** file of the project.

```jsx
import { SandpackRunner } from 'react-smooshpack';

<SandpackRunner code={`...`} template="vue" />;
```

In this example, `code` will replace the `App.vue` file, because that is the
**main** file in the vue template. For `react`, this would be the `App.js` file.

> The main file can be specified in the customSetup. You can use any of your
> files to override with the code prop.

## Getting deeper

If you open a preset file from the sandpack repository, you'll see it is made up
of smaller sandpack **components** and has limited logic for passing props to
those smaller components.

If you need a more custom solution, you can opt in to use these smaller
components that we export from the main package.

It all starts with the `SandpackProvider`, which is the central point of our
architecture. The provider abstracts the functionality of `sandpack` and places
the relevant state values and functions on a `context` object. The `React`
components that are exported by the main package (eg: SandpackCodeEditor,
SandpackPreview) use that `context` object to communicate with `sandpack`.

### Build your custom Sandpack

Let's start from the `SandpackProvider`. This becomes the root node of our new
`Sandpack` component.

```jsx
import { SandpackProvider, SandpackPreview } from 'react-smooshpack';

const CustomSandpack = () => (
  <SandpackProvider>
    <SandpackPreview />
  </SandpackProvider>
);
```

The `SandpackProvider` has the same style of parameters for the input:
`template` and `customSetup`. Additionally you can pass options for the bundler
and execution mode. So even if you run this basic snippet above, you will see a
default vanilla template preview, because the sandpack logic is running behind
the scenes through the context object.

However, you will notice that the buttons on the Preview look off. This is
because there is no root node to set the styling and the theme variables.

You can fix that with the `SandpackThemeProvider`:

```jsx
import {
  SandpackProvider,
  SandpackThemeProvider,
  SandpackPreview,
} from 'react-smooshpack';

const CustomSandpack = () => (
  <SandpackProvider>
    <SandpackThemeProvider>
      <SandpackPreview />
    <SandpackThemeProvider/>
  </SandpackProvider>
);
```

The theme provider component will also render a wrapper div around your sandpack
components. That div ensures the theme variables and styling is specific to this
instance of sandpack.

Let's add a code editor and introduce the `SandpackLayout` component.

```jsx
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
} from 'react-smooshpack';

const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
```

And now we have pretty much the same component as the preset, minus the prop
passing, which you can decide based on your specific needs.

> `SandpackLayout` gives you the left-right split between two components and
> also breaks the columns when the component is under 700px wide, so you have
> some responsiveness built-in. It also renders the SandpackThemeProvider.

You can also bring other components in the mix: `SandpackCodeViewer`,
`SandpackTranspiledCode`, `FileTabs`, `Navigator` and so on.

Some of the components have configuration flags that toggle subparts on/off. All
of them comunicate with sandpack through the shared context.

For example, you can create an editor instance that gives you the transpiled
code of your **active** component instead of the preview page:

```jsx
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackTranspiledCode,
} from 'react-smooshpack';

const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SandpackTranspiledCode />
    </SandpackLayout>
  </SandpackProvider>
);
```

You will notice that the theming applies to all components in the same way, as
the theme object is also distributed by the context.

### Create a custom sandpack-aware component

If you want to build a new component or you want to re-implement the code
editor, for example, you can still rely on the sandpack state and create your UI
from scratch.

We added a set of hooks in the main package, with which you can connect your own
components to the sandpack context.

#### useSandpack

To access the sandpack state in any of your components, you can use the
`useSandpack` hook, as long as the component that uses that hook is mounted
inside the `<SandpackProvider>`.

Let's build a simple code viewer:

```jsx
import { useSandpack } from 'react-smooshpack';

const SimpleCodeViewer = () => {
  const { sandpack } = useSandpack();
  const { files, activePath } = sandpack;

  const code = files[activePath].code;
  return <pre>{code}</pre>;
};
```

The `sandpack` object is available in any component and exposes all the internal
state:

- the `files` including all the setup/template files
- the `activePath` / `openPaths` fields
- the `error` object, if any
- multiple functions for changing the state of sandpack: `updateCurrentFile`,
  `changeActiveFile`, etc.

In the component above, you get the active code string by calling
`files[activePath].code`, so any change of state will trigger a re-render of the
component and an update of the code.

We can test this with the `CustomSandpack` we implemented at the previous step.

```jsx
const CustomSandpack = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackCodeEditor />
      <SimpleCodeViewer /> {/* This will render the pre on the right side of your sandpack component */}
    </SandpackLayout>
  </SandpackProvider>
);
```

`useSandpack` also exports `dispatch` and `listen`, two functions with which you
can directly communicate with the bundler. However, at this point, you'd have to
understand all the different types of messages and payloads that are passed from
the sandpack manager to the iframe and back.

```jsx
import { useSandpack } from 'react-smooshpack';

const CustomRefreshButton = () => {
  const { dispatch, listen } = useSandpack();

  const handleRefresh = () => {
    // listens for any message dispatched between sandpack and the bundler
    const stopListening = listen(message => console.log(message));

    // sends the refresh message to the bundler, should be logged by the listener
    dispatch({ type: 'refresh' });

    // unsubscribe
    stopListening();
  };

  return (
    <button type="button" onClick={handleRefresh}>
      Refresh
    </button>
  );
};
```

#### useActiveCode, useCodeSandboxLink, useSandpackNavigation

Some of the common functionalities of sandpack are also extracted into
specialized hooks. These all use `useSandpack` under the hood, but abstract away
the shape of the **state** object and the **dispatch/listen** functions.

The refresh button can be built with the `useSandpackNavigation` hook:

```jsx
import { useSandpackNavigation } from 'react-smooshpack';

const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button type="button" onClick={() => refresh()}>
      Refresh Sandpack
    </button>
  );
};
```

Similarly, we can build a custom link that opens the sandpack files in a new tab
on https://codesandbox.io. Let's the use `useCodeSandboxLink` for that:

```jsx
import { useCodeSandboxLink } from 'react-smooshpack';

const CustomOpenInCSB = () => {
  const url = useCodeSandboxLink();
  return (
    <a href={url} target="_blank" rel="noopener noreferrer">
      Open in CodeSandbox
    </a>
  );
};
```

We implemented the `SandpackCodeEditor` on top of
[codemirror/next](https://codemirror.net/6/), but it is super easy to switch to
your favorite code editor. Let's connect the sandpack state to an instance of
[AceEditor](https://securingsincity.github.io/react-ace/). We can use the
`useActiveCode` hook, which gives us the `code` and the `updateCode` callback.

```jsx
import { useActiveCode } from 'react-smooshpack';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-textmate';

const CustomAceEditor = () => {
  const { code, updateCode } = useActiveCode();

  return (
    <AceEditor
      mode="javascript"
      defaultValue={code}
      onChange={updateCode}
      fontSize={14}
      height="300px"
      width="100%"
    />
  );
};
```

Now, let's put all of these custom components together:

```jsx
export const CustomSandpack = () => (
  <SandpackProvider template="react">
    <CustomAceEditor />
    <SandpackPreview showRefreshButton={false} showOpenInCodeSandbox={false} />
    <CustomRefreshButton />
    <CustomOpenInCSB />
  </SandpackProvider>
);
```

It's not pretty, but with just a few lines of code, you can create a whole new
component that uses the power of sandpack, but has all the UI and functionality
you need for your specific use case.

Notice how the `SandpackPreview` is the only component left from our package.
You can also implement your own preview component, but we recommend sticking
with the standard one, as it is a bit more coupled to the bundler
implementation.

### Sandpack Manager

Coming soon

## Development

Coming soon
