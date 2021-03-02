import React from 'react';
import { Story } from '@storybook/react';

import { SandpackCodeViewer, CodeViewerProps } from '.';

import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackThemeProvider } from '../../contexts/theme-context';

export default {
  title: 'components/Code Viewer',
  component: SandpackCodeViewer,
};

export const Component: Story<CodeViewerProps> = args => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      files: {
        '/index.js': {
          code: 'const title = "This is not editable" // this is a comaent',
        },
      },
    }}
  >
    <SandpackThemeProvider>
      <SandpackCodeViewer {...args} />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const ReactCode = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);

export const VueCode = () => (
  <SandpackProvider template="vue">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeViewer />
    </SandpackThemeProvider>
  </SandpackProvider>
);
