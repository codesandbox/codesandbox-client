import React from 'react';
import { Story } from '@storybook/react';

import { CodeEditor, CodeEditorProps } from './index';

import { SandpackProvider } from '../../contexts/sandpack-context';

export default {
  title: 'components/Code Editor',
  component: CodeEditor,
};

export const Component: Story<CodeEditorProps> = args => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      files: {
        '/index.js': {
          code: 'const title = "This is a simple code editor"',
        },
      },
    }}
  >
    <CodeEditor {...args} />
  </SandpackProvider>
);

export const ReactCode = () => (
  <SandpackProvider template="react">
    <CodeEditor showLineNumbers />
  </SandpackProvider>
);

export const VueCode = () => (
  <SandpackProvider template="vue">
    <CodeEditor />
  </SandpackProvider>
);

export const DarkTheme = () => (
  <SandpackProvider template="vue" theme="sp-dark">
    <CodeEditor />
  </SandpackProvider>
);
