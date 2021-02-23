import React from 'react';
import { Story } from '@storybook/react';
import { IFile } from 'smooshpack';
import { Sandpack, SandpackProps } from './Sandpack';
import { getSetup } from '../templates';
import { sandpackDarkTheme } from '../themes';

export default {
  title: 'presets/Sandpack',
  component: Sandpack,
};

const reactCode = `import Button from './button';
import Link from './link';

export default function App() {
  return (
    <div>
      <h1>Hello World</h1>
      <Button />
      <Link />
    </div>
  )
}
`;

const buttonCode = `export default function Button() {
  return <button>Click me</button>
}
`;

const linkCode = `export default function Link() {
  return <a href="https://www.example.com" target="_blank">Click Here</a>
}`;

export const ReactEditor: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    files={{
      '/App.js': reactCode,
      '/button.js': buttonCode,
      '/link.js': linkCode,
    }}
    options={{
      showLineNumbers: true,
    }}
    template="react"
  />
);

export const VanillaEditor: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    template="vanilla"
    options={{
      openPaths: ['/src/index.js', '/src/styles.css'],
      showNavigator: true,
    }}
  />
);

export const DarkTheme: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    files={{
      '/App.js': reactCode,
      '/button.js': {
        code: buttonCode,
      },
      '/link.js': {
        code: linkCode,
        hidden: true,
      },
    }}
    template="react"
    theme="sp-dark"
  />
);

export const CustomSetup: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    options={{ wrapContent: true }}
    theme="night-owl"
    files={{
      './tsconfig.json': {
        code: `{
"include": [
  "./src/**/*"
],
"compilerOptions": {
  "strict": true,
  "esModuleInterop": true,
  "lib": [
    "dom",
    "es2015"
  ],
  "jsx": "react"
}
}`,
        hidden: true,
      },
      '/public/index.html': {
        code: `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Document</title>
</head>
<body>
<div id="root"></div>
</body>
</html>`,
        hidden: true,
      },

      '/src/index.tsx': {
        code: `import * as React from "react";
import { render } from "react-dom";

import { Main } from "./main";

const rootElement = document.getElementById("root");
render(<Main test="World"/>, rootElement);
        `,
        hidden: true,
      },

      '/src/main.tsx': {
        code: `import * as React from "react";

export const Main: React.FC<{test: string}> = ({test}) => {
  return (
    <h1>Hello {test}</h1>
  )
}`,
      },
    }}
    customSetup={{
      entry: '/src/index.tsx',
      main: '/src/main.tsx',
      dependencies: {
        react: 'latest',
        'react-dom': 'latest',
        'react-scripts': '4.0.0',
      },
    }}
  />
);

const reactWithLibCode = `import ReactMarkdown from 'react-markdown' 

export default function App() {
  return <ReactMarkdown># Hello, *world*!</ReactMarkdown>
}`;

export const WithCustomLibrary: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    template="react"
    files={{
      '/App.js': reactWithLibCode,
    }}
    customSetup={{
      dependencies: {
        'react-markdown': 'latest',
      },
    }}
  />
);

const helloWorld = `export default function App() {
  return (
    <h1>Hello World</h1>
  )
}
`;

export const MultipleInstances: Story<SandpackProps> = args => (
  <div>
    <h2>Light Theme</h2>
    <Sandpack
      {...args}
      files={{
        '/App.js': helloWorld.replace('World', 'world 1'),
      }}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
    />
    <h2>Dark Theme</h2>
    <Sandpack
      {...args}
      files={{
        '/App.js': helloWorld.replace('World', 'world 2'),
      }}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme="sp-dark"
    />
    <h2>Night Owl</h2>
    <Sandpack
      {...args}
      files={{
        '/App.js': helloWorld.replace('World', 'world 3'),
      }}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme="night-owl"
    />
    <h2>Custom Theme Colors</h2>
    <Sandpack
      {...args}
      files={{
        '/App.js': helloWorld.replace('World', 'world 4'),
      }}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
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
    <h2>Custom Theme Typography</h2>
    <Sandpack
      {...args}
      files={{
        '/App.js': helloWorld.replace('World', 'world 5'),
      }}
      options={{
        showTabs: true,
        showNavigator: true,
      }}
      template="react"
      theme={{
        ...sandpackDarkTheme,
        typography: {
          fontSize: '16px',
          bodyFont: 'Arial',
        },
      }}
    />
  </div>
);

const code = `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`;

export const RunnableComponent = () => {
  const projectSetup = getSetup('react');

  // Replace the code in the main file
  if (code) {
    const mainFileName = projectSetup.main;
    const mainFile: IFile = {
      code,
    };

    projectSetup.files = {
      ...projectSetup.files,
      [mainFileName]: mainFile,
    };
  }

  return (
    <Sandpack
      customSetup={projectSetup}
      options={{
        autorun: false,
        showTabs: true,
        showLineNumbers: true,
        showNavigator: true,
      }}
    />
  );
};
