import React from 'react';
import { FileExplorer } from './index';

import { SandpackProvider } from '../../contexts/sandpack-context';
import { SandpackLayout } from '../../common/Layout';

export default {
  title: 'components/File Explorer',
};

export const Component = () => (
  <SandpackProvider
    customSetup={{
      entry: '/index.tsx',
      files: {
        '/index.tsx': '',
        '/src/app.tsx': '',
        '/src/components/button.tsx': '',
      },
    }}
  >
    <SandpackLayout>
      <FileExplorer />
    </SandpackLayout>
  </SandpackProvider>
);
