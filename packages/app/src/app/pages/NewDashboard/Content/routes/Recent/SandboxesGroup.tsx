import React from 'react';
import { useOvermind } from 'app/overmind';
import { Text } from '@codesandbox/components';
import { SandboxGrid, SkeletonGrid } from '../../../Components/SandboxGrid';

export const SandboxesGroup = ({ title, time }) => {
  const {
    state: {
      dashboard: { recentSandboxesByTime, getFilteredSandboxes },
    },
  } = useOvermind();

  return getFilteredSandboxes(recentSandboxesByTime[time]).length ? (
    <>
      <Text marginBottom={6} block>
        {title}
      </Text>
      <SandboxGrid
        sandboxes={getFilteredSandboxes(recentSandboxesByTime[time])}
      />
    </>
  ) : null;
};

export const SkeletonGroup = ({ title, time }) => (
  <>
    <Text marginBottom={6} block>
      {title}
    </Text>
    <SkeletonGrid count={4} />
  </>
);
