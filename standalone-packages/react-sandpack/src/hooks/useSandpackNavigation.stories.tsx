import React from 'react';
import { SandpackLayout } from '../common/Layout';
import { SandpackPreview } from '../components/Preview';
import { SandpackProvider } from '../contexts/sandpack-context';
import { useSandpackNavigation } from './useSandpackNavigation';

export default {
  title: 'hooks/useSandpackNavigation',
};

const CustomRefreshButton = () => {
  const { refresh } = useSandpackNavigation();
  return (
    <button type="button" onClick={refresh}>
      Refresh
    </button>
  );
};

export const CustomCodeEditor = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <SandpackPreview showRefreshButton={false} />
    </SandpackLayout>
    <CustomRefreshButton />
  </SandpackProvider>
);
