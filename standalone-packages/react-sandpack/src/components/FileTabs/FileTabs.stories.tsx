import React from 'react';
import { FileTabs } from './index';
import { SandpackCodeViewer } from '../CodeViewer';
import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackLayout } from '../../components/Layout';

export default {
  title: 'components/File Tabs',
};

export const Component = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
      files: {
        '/index.tsx': '',
        '/src/app.tsx': { code: '', active: true },
        '/src/components/button.tsx': '',
      },
    }}
  >
    <FileTabs />
  </SandpackProvider>
);

export const WithHiddenFiles = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
      files: {
        '/index.tsx': { code: '', hidden: true },
        '/src/app.tsx': 'Hello',
        '/src/components/button.tsx': 'World',
      },
    }}
  >
    <SandpackLayout>
      <div>
        <FileTabs />
        <SandpackCodeViewer showTabs={false} />
      </div>
    </SandpackLayout>
  </SandpackProvider>
);
