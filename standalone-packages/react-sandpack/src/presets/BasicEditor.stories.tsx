import React from 'react';
import { Story } from '@storybook/react';
import { BasicEditor, BasicEditorProps } from './BasicEditor';

export default {
  title: 'presets/Basic Editor',
  component: BasicEditor,
  argTypes: {
    code: { control: { disable: true } },
  },
};

const reactCode = `import React from 'react';

export default function App() {
  return <h1>Hello World</h1>
}
`;

const reactTSCode = `import React from 'react';

export interface Props {
  test: string
}

export const Main: React.FC<Props> = ({test}) => {
  return <h1>Hello {test}</h1>
}
`;

const vueCode = `<template>
  <main id="app">
    <h1>Hello world</h1>
  </main>
</template>

<script>
  export default {
    name: "App",
  };
</script>

<style>
  #app {
    font-family: "Avenir", Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
`;

export const ReactEditor: Story<BasicEditorProps> = args => (
  <BasicEditor {...args} code={reactCode} template="react" />
);
export const MultipleEditor: Story<BasicEditorProps> = args => (
  <div>
    <BasicEditor
      {...args}
      code={reactCode.replace('World', 'world 1')}
      template="react"
    />
    <BasicEditor
      {...args}
      code={reactCode.replace('World', 'world 2')}
      template="react"
    />
  </div>
);
export const VueEditor: Story<BasicEditorProps> = args => (
  <BasicEditor {...args} code={vueCode} template="vue" />
);

export const VanillaEditor: Story<BasicEditorProps> = args => (
  <BasicEditor {...args} template="vanilla" />
);

export const CustomSetup: Story<BasicEditorProps> = args => (
  <BasicEditor
    {...args}
    code={reactTSCode}
    customSetup={{
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
      },
    }}
  />
);

const reactWithLibCode = `import React from 'react';
import ReactMarkdown from 'react-markdown' 

export default function App() {
  return <ReactMarkdown># Hello, *world*!</ReactMarkdown>
}`;

export const WithCustomLibrary: Story<BasicEditorProps> = args => (
  <BasicEditor
    {...args}
    code={reactWithLibCode}
    template="react"
    customSetup={{
      dependencies: {
        'react-markdown': 'latest',
      },
    }}
  />
);
