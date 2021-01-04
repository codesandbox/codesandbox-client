import React from 'react';
import { FileExplorer } from './index';

import { SandpackProvider } from '../../utils/sandpack-context';
import { SandpackWrapper } from '../../elements';

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
    <SandpackWrapper>
      <FileExplorer />
    </SandpackWrapper>
  </SandpackProvider>
);
