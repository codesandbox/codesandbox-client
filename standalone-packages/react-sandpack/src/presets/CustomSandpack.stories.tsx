import React from 'react';

import {
  Preview,
  SandpackProvider,
  OpenInCodeSandboxButton,
  RefreshButton,
  ThemeProvider,
  SandpackLayout,
  CodeViewer,
  CodeEditor,
  useCodeSandboxLink,
  useSandpackActions,
} from '../index';

import { SANDBOX_TEMPLATES } from '../templates';

export default {
  title: 'presets/Custom Sandpack',
};

export const UsingSandpackLayout = () => (
  <ThemeProvider theme="sp-dark">
    <SandpackProvider
      files={SANDBOX_TEMPLATES.react.files}
      dependencies={SANDBOX_TEMPLATES.react.dependencies}
      entry="/index.js"
    >
      <SandpackLayout>
        <CodeViewer />
        <Preview showNavigator />
      </SandpackLayout>
    </SandpackProvider>
  </ThemeProvider>
);

export const UsingVisualElements = () => (
  <ThemeProvider theme="sp-dark">
    <SandpackProvider
      files={SANDBOX_TEMPLATES.react.files}
      dependencies={SANDBOX_TEMPLATES.react.dependencies}
      activePath="/App.js"
      entry="/index.js"
    >
      <CodeEditor customStyle={{ width: 400, height: 200 }} />

      <div
        style={{
          border: '1px solid red',
          marginBottom: 4,
          marginTop: 4,
          width: 400,
        }}
      >
        <Preview showRefreshButton={false} showOpenInCodeSandbox={false} />
      </div>
      <div
        style={{ display: 'flex', width: 400, justifyContent: 'space-between' }}
      >
        <OpenInCodeSandboxButton />
        <RefreshButton />
      </div>
    </SandpackProvider>
  </ThemeProvider>
);

const CustomOpenInCSB = () => {
  const url = useCodeSandboxLink();
  return <a href={url}>Open in CodeSandbox</a>;
};

const CustomRefreshButton = () => {
  const { refresh } = useSandpackActions();
  return (
    <button type="button" onClick={() => refresh()}>
      Refresh Sandpack
    </button>
  );
};

export const UsingBehavior = () => (
  <SandpackProvider
    files={SANDBOX_TEMPLATES.react.files}
    dependencies={SANDBOX_TEMPLATES.react.dependencies}
    entry="/index.js"
  >
    <div
      style={{
        border: '1px solid red',
        width: 400,
        height: 300,
        display: 'flex',
      }}
    >
      <Preview showOpenInCodeSandbox={false} />
    </div>
    <CustomOpenInCSB />
    <CustomRefreshButton />
  </SandpackProvider>
);
