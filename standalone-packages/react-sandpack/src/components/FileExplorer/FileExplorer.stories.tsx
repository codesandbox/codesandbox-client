import React from 'react';
import { FileExplorer } from './index';

import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackLayout } from '../../components/SandpackLayout';

export default {
  title: 'components/File Explorer',
};

export const Component = () => (
  <SandpackProvider
    entry="/index.tsx"
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
      <FileExplorer />
    </SandpackLayout>
  </SandpackProvider>
);
