import React from 'react';
import { Story } from '@storybook/react';

import { SandpackCodeEditor, CodeEditorProps } from './index';

import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackThemeProvider } from '../../contexts/theme-context';

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
    <SandpackThemeProvider>
      <SandpackCodeEditor {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReactCode = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeEditor showLineNumbers />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const VueCode = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider>
      <SandpackCodeEditor />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const DarkTheme = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeEditor />
    </SandpackThemeProvider>
  </SandpackProvider>
);
