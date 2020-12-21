import React from 'react';
import { Navigator } from '.';
import { SandpackProvider } from '../../utils/sandpack-context';

export default {
  title: 'components/Navigator',
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
    <Navigator />
  </SandpackProvider>
);
