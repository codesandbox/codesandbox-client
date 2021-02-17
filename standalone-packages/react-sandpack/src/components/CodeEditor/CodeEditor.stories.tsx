import React from 'react';
import { Story } from '@storybook/react';

import { SandpackCodeEditor, CodeEditorProps } from './index';

import { SandpackProvider } from '../../contexts/sandpack-context';

export default {
  title: 'components/Code Editor',
  component: SandpackCodeEditor,
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
    <SandpackCodeEditor {...args} />
  </SandpackProvider>
);

export const ReactCode = () => (
  <SandpackProvider template="react">
    <SandpackCodeEditor showLineNumbers />
  </SandpackProvider>
);

export const VueCode = () => (
  <SandpackProvider template="vue">
    <SandpackCodeEditor />
  </SandpackProvider>
);

export const DarkTheme = () => (
  <SandpackProvider template="vue" theme="sp-dark">
    <SandpackCodeEditor />
  </SandpackProvider>
);
