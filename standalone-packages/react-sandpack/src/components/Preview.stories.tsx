import React from 'react';
import { Preview } from './Preview';
import { SandpackWrapper } from '../elements';

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
    <SandpackWrapper>
      <Preview />
    </SandpackWrapper>
  </SandpackProvider>
);
