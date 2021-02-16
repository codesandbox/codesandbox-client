import React from 'react';

import {
  Preview,
  SandpackProvider,
  OpenInCodeSandboxButton,
  RefreshButton,
  SandpackLayout,
  CodeViewer,
  CodeEditor,
  useCodeSandboxLink,
  useSandpackActions,
} from '../index';

export default {
  title: 'presets/Custom Sandpack',
};

export const UsingSandpackLayout = () => (
  <SandpackProvider template="react" theme="sp-dark">
    <SandpackLayout>
      <CodeViewer />
      <Preview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);

export const UsingVisualElements = () => (
  <SandpackProvider template="react" theme="sp-dark" activePath="/App.js">
    <CodeEditor
      customStyle={{
        width: 500,
        height: 300,
        display: 'flex',
        flexDirection: 'column',
      }}
    />

    <div
      style={{
        border: '1px solid red',
        marginBottom: 4,
        marginTop: 4,
        width: 500,
        height: 300,
      }}
    >
      <Preview showRefreshButton={false} showOpenInCodeSandbox={false} />
    </div>
    <div
      style={{
        display: 'flex',
        width: 500,
        justifyContent: 'space-between',
      }}
    >
      <OpenInCodeSandboxButton />
      <RefreshButton />
    </div>
  </SandpackProvider>
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
  <SandpackProvider template="react">
    <div
      style={{
        border: '1px solid red',
        width: 400,
        height: 300,
        display: 'flex',
      }}
    >
      <Preview showRefreshButton={false} showOpenInCodeSandbox={false} />
    </div>
    <CustomOpenInCSB />
    <CustomRefreshButton />
  </SandpackProvider>
);
