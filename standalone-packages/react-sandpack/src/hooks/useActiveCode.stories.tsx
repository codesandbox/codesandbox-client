import React from 'react';
import { SandpackPreview } from '../components/Preview';
import { SandpackLayout } from '../common/Layout';
import { SandpackProvider } from '../contexts/sandpack-context';
import { useActiveCode } from './useActiveCode';

export default {
  title: 'hooks/useActiveCode',
};

const CustomEditor = () => {
  const { code, updateCode } = useActiveCode();
  return (
    <textarea onChange={evt => updateCode(evt.target.value)}>{code}</textarea>
  );
};

export const CustomCodeEditor = () => (
  <SandpackProvider template="react">
    <SandpackLayout>
      <CustomEditor />
      <SandpackPreview />
    </SandpackLayout>
  </SandpackProvider>
);
