import React from 'react';
import { Story } from '@storybook/react';

import { CodeViewer, CodeViewerProps } from '.';

import { SandpackProvider } from '../../contexts/sandpack-context';

export default {
  title: 'components/Code Viewer',
  component: CodeViewer,
};

export const Component: Story<CodeViewerProps> = args => (
  <SandpackProvider
    customSetup={{
      entry: '/index.js',
      files: {
        '/index.js': {
          code: 'const title = "This is not editable"',
        },
      },
    }}
  >
    <CodeViewer {...args} />
  </SandpackProvider>
);

export const ReactCode = () => (
  <SandpackProvider template="react">
    <CodeViewer />
  </SandpackProvider>
);

export const VueCode = () => (
  <SandpackProvider template="vue" theme="sp-dark">
    <CodeViewer />
  </SandpackProvider>
);
