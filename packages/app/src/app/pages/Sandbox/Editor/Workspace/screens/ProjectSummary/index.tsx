import React from 'react';
import { useOvermind } from 'app/overmind';
import { Explorer } from '../Explorer';
import { SandboxInfo } from './info';

export const ProjectSummary = () => {
  const {
    state: {
      editor: { currentSandbox },
    },
  } = useOvermind();

  return (
    <>
      <SandboxInfo sandbox={currentSandbox} />

      <Explorer filesDefaultOpen={false} />
    </>
  );
};
