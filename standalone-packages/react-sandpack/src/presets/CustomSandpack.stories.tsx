import React from 'react';

import {
  SandpackPreview,
  SandpackProvider,
  SandpackThemeProvider,
  OpenInCodeSandboxButton,
  RefreshButton,
  SandpackLayout,
  SandpackCodeViewer,
  SandpackCodeEditor,
  SandpackTranspiledCode,
  useCodeSandboxLink,
  useSandpackTheme,
  useActiveCode,
  useSandpackNavigation,
} from '../index';

export default {
  title: 'presets/Custom Sandpack',
};

export const UsingSandpackLayout = () => (
  <SandpackProvider template="react">
    <SandpackLayout theme="codesandbox-dark">
      <SandpackTranspiledCode />
      <SandpackCodeViewer />
    </SandpackLayout>
  </SandpackProvider>
);

export const UsingVisualElements = () => (
  <SandpackProvider template="react" activePath="/App.js">
    <SandpackThemeProvider theme="codesandbox-dark">
      <SandpackCodeEditor
        customStyle={{
          width: 500,
          height: 300,
        }}
      />

      <SandpackPreview
        showRefreshButton={false}
        showOpenInCodeSandbox={false}
        customStyle={{
          border: '1px solid red',
          marginBottom: 4,
          marginTop: 4,
          width: 500,
          height: 300,
        }}
      />

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
    </SandpackThemeProvider>
  </SandpackProvider>
);

const CustomOpenInCSB = () => {
  const url = useCodeSandboxLink();
  return <a href={url}>Open in CodeSandbox</a>;
};

const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button type="button" onClick={() => refresh()}>
      Refresh Sandpack
    </button>
  );
};

const CustomCodeEditor = () => {
  const { code, updateCode } = useActiveCode();
  const { theme } = useSandpackTheme();

  return (
    <textarea
      onChange={evt => updateCode(evt.target.value)}
      style={{
        width: 400,
        height: 200,
        padding: 8,
        fontFamily: theme.typography.monoFont,
        fontSize: theme.typography.fontSize,
        background: theme.palette.defaultBackground,
        border: `1px solid ${theme.palette.inactiveText}`,
        color: theme.palette.activeText,
        lineHeight: 1.4,
      }}
    >
      {code}
    </textarea>
  );
};

export const UsingHooks = () => (
  <SandpackProvider template="react">
    <SandpackThemeProvider>
      <CustomCodeEditor />

      <SandpackPreview
        showRefreshButton={false}
        showOpenInCodeSandbox={false}
        customStyle={{ border: '1px solid red', width: 400, height: 300 }}
      />

      <div
        style={{
          display: 'flex',
          width: 400,
          margin: '8px 0',
          justifyContent: 'space-between',
        }}
      >
        <CustomRefreshButton />
        <CustomOpenInCSB />
      </div>

      <SandpackTranspiledCode customStyle={{ width: 400, height: 300 }} />
    </SandpackThemeProvider>
  </SandpackProvider>
);
