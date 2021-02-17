import React from 'react';
import { Story } from '@storybook/react';

import { CodeViewer, CodeViewerProps } from '.';
import { SandpackLayout } from '../../components/SandpackLayout';

import { SandpackProvider } from '../../contexts/sandpack-context';
import { SANDBOX_TEMPLATES } from '../../templates';
import { ThemeProvider } from '../../contexts/theme-context';

export default {
  title: 'components/Code Viewer',
  component: CodeViewer,
};

export const Component: Story<CodeViewerProps> = args => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: 'const title = "This is a simple code editor"',
      },
    }}
    dependencies={{}}
  >
    <SandpackLayout>
      <CodeViewer {...args} />
    </SandpackLayout>
  </SandpackProvider>
);

const reactTemplate = SANDBOX_TEMPLATES.react;

export const ReactCode = () => (
  <SandpackProvider
    entry={reactTemplate.entry}
    environment="create-react-app"
    files={reactTemplate.files}
    openPaths={[reactTemplate.main]}
    dependencies={reactTemplate.dependencies}
  >
    <SandpackLayout>
      <CodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);

const vueTemplate = SANDBOX_TEMPLATES.vue;

export const VueCode = () => (
  <SandpackProvider
    entry={vueTemplate.entry}
    environment="vue-cli"
    files={vueTemplate.files}
    openPaths={[vueTemplate.main]}
    dependencies={vueTemplate.dependencies}
  >
    <ThemeProvider theme="sp-dark">
      <SandpackLayout>
        <CodeViewer />
      </SandpackLayout>
    </ThemeProvider>
  </SandpackProvider>
);
