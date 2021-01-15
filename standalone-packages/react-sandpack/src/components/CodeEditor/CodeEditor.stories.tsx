import React from 'react';
import { Story } from '@storybook/react';

import { CodeEditor, CodeEditorProps } from './index';
import { SandpackLayout } from '../../components/SandpackLayout';

import { SandpackProvider } from '../../utils/sandpack-context';
import { SANDBOX_TEMPLATES } from '../../templates';
import { compileStitchesTheme, ThemeProvider } from '../../utils/theme-context';
import { sandpackDarkTheme } from '../../themes';

export default {
  title: 'components/Code Editor',
  component: CodeEditor,
};

export const Component: Story<CodeEditorProps> = args => (
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
      <CodeEditor {...args} />
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
      <CodeEditor />
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
    <SandpackLayout>
      <CodeEditor />
    </SandpackLayout>
  </SandpackProvider>
);

export const DarkTheme = () => (
  <ThemeProvider value={sandpackDarkTheme}>
    <SandpackProvider
      entry={vueTemplate.entry}
      environment="vue-cli"
      files={vueTemplate.files}
      openPaths={[vueTemplate.main]}
      dependencies={vueTemplate.dependencies}
    >
      <SandpackLayout className={compileStitchesTheme(sandpackDarkTheme)}>
        <CodeEditor />
      </SandpackLayout>
    </SandpackProvider>
  </ThemeProvider>
);
