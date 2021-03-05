import React from 'react';
import { SandpackPreview } from './index';
import { SandpackLayout } from '../../common/Layout';

import { SandpackProvider } from '../../contexts/sandpack-context';

export default {
  title: 'components/Preview',
};

const code = `export default function Kitten() {
  return (
    <img src="https://placekitten.com/200/250" alt="Kitten" />
  );
}`;

export const Component = () => (
  <SandpackProvider
    template="react"
    customSetup={{
      files: {
        '/App.js': code,
      },
    }}
  >
    <SandpackLayout>
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);

export const WithNavigator = () => (
  <SandpackProvider
    template="react"
    customSetup={{
      files: {
        '/App.js': code,
      },
    }}
  >
    <SandpackLayout>
      <SandpackPreview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);
