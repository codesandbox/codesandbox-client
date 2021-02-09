import React from 'react';
import { Story } from '@storybook/react';
import { IFile } from 'smooshpack';
import { Sandpack, SandpackProps } from './Sandpack';
import { sandpackDarkTheme } from '../themes';
import { getSetup } from '../templates';

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
    setup={{
      files: {
        '/App.js': reactCode,
        '/button.js': buttonCode,
        '/link.js': linkCode,
      },
    }}
    template="react"
  />
);

export const VanillaEditor: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    template="vanilla"
    openPaths={['/src/index.js', '/src/styles.css']}
    previewOptions={{ showNavigator: false }}
  />
);

export const DarkTheme: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    setup={{
      files: {
        '/App.js': reactCode,
        '/button.js': buttonCode,
        '/link.js': linkCode,
      },
    }}
    template="react"
    theme={sandpackDarkTheme}
    activePath="/button.js"
  />
);

export const CustomSetup: Story<SandpackProps> = args => (
  <Sandpack
    {...args}
    setup={{
      entry: '/src/index.tsx',
      main: '/src/main.tsx',
      dependencies: {
        react: 'latest',
        'react-dom': 'latest',
        'react-scripts': '3.3.0',
      },
      files: {
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
        },

        '/src/index.tsx': {
          code: `import * as React from "react";
  import { render } from "react-dom";
  
  import { Main } from "./main";
  
  const rootElement = document.getElementById("root");
  render(<Main test="World"/>, rootElement);
          `,
        },

        '/src/main.tsx': {
          code: `import * as React from "react";

export const Main: React.FC<{test: string}> = ({test}) => {
  return (
    <h1>Hello {test}</h1>
  )
}`,
        },
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
    setup={{
      files: {
        '/App.js': reactWithLibCode,
      },
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
    <Sandpack
      {...args}
      setup={{
        files: {
          '/App.js': helloWorld.replace('World', 'world 1'),
        },
      }}
      template="react"
    />
    <Sandpack
      {...args}
      setup={{
        files: {
          '/App.js': helloWorld.replace('World', 'world 2'),
        },
      }}
      template="react"
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
      setup={projectSetup}
      executionOptions={{ autorun: false }}
      codeOptions={{ showTabs: false, showLineNumbers: false }}
      previewOptions={{ showNavigator: false, showOpenInCodeSandbox: false }}
    />
  );
};
