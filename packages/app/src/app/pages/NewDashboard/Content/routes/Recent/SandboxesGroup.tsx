import React from 'react';
import { useOvermind } from 'app/overmind';
import { Text, Column } from '@codesandbox/components';
import { Sandbox, SkeletonSandbox } from '../../../Components/Sandbox';
import { SandboxGrid } from '../../../Components/SandboxGrid';

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
      <SandboxGrid>
        {getFilteredSandboxes(recentSandboxesByTime[time]).map(sandbox => (
          <Sandbox key={sandbox.id} sandbox={sandbox} />
        ))}
      </SandboxGrid>
    </>
  ) : null;
};

export const SkeletonGroup = ({ title, time }) => (
  <>
    <Text marginBottom={6} block>
      {title}
    </Text>
    <SandboxGrid>
      {Array.from(Array(4).keys()).map(n => (
        <Column key={n}>
          <SkeletonSandbox />
        </Column>
      ))}
    </SandboxGrid>
  </>
);
