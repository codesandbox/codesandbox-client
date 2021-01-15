import React from 'react';
import { Preview } from './Preview';
import { SandpackLayout } from './SandpackLayout';

import { SandpackProvider } from '../utils/sandpack-context';

export default {
  title: 'components/Preview',
};

export const Component = () => (
  <SandpackProvider
    entry="/index.js"
    files={{
      '/index.js': {
        code: '',
      },
    }}
    dependencies={{}}
  >
    <SandpackLayout>
      <Preview />
    </SandpackLayout>
  </SandpackProvider>
);
