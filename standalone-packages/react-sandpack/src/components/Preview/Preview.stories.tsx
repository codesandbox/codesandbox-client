import React from 'react';
import { Preview } from './index';
import { SandpackLayout } from '../SandpackLayout';

import { SandpackProvider } from '../../contexts/sandpack-context';

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

export const WithNavigator = () => (
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
      <Preview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);
