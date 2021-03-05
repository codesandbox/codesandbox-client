import React from 'react';
import { useSandpack } from '../hooks/useSandpack';

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
  SandpackStack,
} from '../index';

export default {
  title: 'presets/Custom Sandpack',
};

export const UsingSandpackLayout = () => (
  <SandpackProvider template="react">
    <SandpackLayout theme="codesandbox-dark">
      <SandpackStack>
        <SandpackTranspiledCode />
      </SandpackStack>
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

      <div style={{ width: 400 }}>
        <SandpackTranspiledCode />
      </div>
    </SandpackThemeProvider>
  </SandpackProvider>
);

const code1 = `import React from 'react'

function Kitten() {
  return (
    <img 
      src="https://placekitten.com/200/200" 
      alt="Kitten" 
    />
  )
}

export default function KittenGallery() {
  return (
    <section>
      <h1>A Gallery of Adorable Kittens</h1>
      <Kitten />
      <Kitten />
      <Kitten />
    </section>
  );
}`;
const code2 = `import React from 'react'

export default function KittenGallery() {
  return (
    <img 
      src="https://placekitten.com/200/200" 
      alt="Kitten" 
    />
  )
}`;

const CustomPreview = () => {
  const { sandpack } = useSandpack();

  return (
    <iframe
      style={{
        width: 400,
        height: 400,
      }}
      ref={sandpack.iframeRef}
      title="Sandpack Preview"
    />
  );
};

export const JustIframe = () => {
  const [first, setFirst] = React.useState(true);
  const code = first ? code1 : code2;

  return (
    <SandpackProvider
      template="react"
      customSetup={{
        files: {
          '/App.js': code,
        },
      }}
    >
      <CustomPreview />
      <div
        style={{
          display: 'flex',
          width: 400,
          margin: '8px 0',
          justifyContent: 'space-between',
        }}
      >
        <CustomRefreshButton />
        <button type="button" onClick={() => setFirst(!first)}>
          Switch
        </button>
        <CustomOpenInCSB />
      </div>
    </SandpackProvider>
  );
};
