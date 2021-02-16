import React from 'react';
import { Preview } from './index';
import { SandpackLayout } from '../SandpackLayout';

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
      <Preview />
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
      <Preview showNavigator />
    </SandpackLayout>
  </SandpackProvider>
);
