import React from 'react';
import { FileTabs } from './index';

import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackLayout } from '../../components/SandpackLayout';

export default {
  title: 'components/File Tabs',
};

export const Component = () => (
  <SandpackProvider
    entry="/index.tsx"
    openPaths={['/index.tsx', '/src/app.tsx', '/src/components/button.tsx']}
    files={{
      '/index.tsx': {
        code: '',
      },
      '/src/app.tsx': {
        code: '',
      },
      '/src/components/button.tsx': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <SandpackLayout>
      <FileTabs />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithHiddenFiles = () => (
  <SandpackProvider
    entry="/index.tsx"
    openPaths={['/src/app.tsx', '/src/components/button.tsx']}
    files={{
      '/index.tsx': {
        // Not visible
        code: '',
      },
      '/src/app.tsx': {
        code: '',
      },
      '/src/components/button.tsx': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <SandpackLayout>
      <FileTabs />
    </SandpackLayout>
  </SandpackProvider>
);
