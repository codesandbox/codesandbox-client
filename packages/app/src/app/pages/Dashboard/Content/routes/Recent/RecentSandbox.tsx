import React from 'react';
import styled from 'styled-components';

import { RecentlyAccessedSandboxFragmentFragment } from 'app/graphql/types';
import { InteractiveOverlay } from '@codesandbox/components';

interface RecentSandboxProps {
  sandbox: RecentlyAccessedSandboxFragmentFragment;
}

/**
 * context menu is going to be an interesting one for this component.
 */
export const RecentSandbox = ({ sandbox }: RecentSandboxProps) => {
  return (
    <InteractiveOverlay>
      <Card>
        <div>{sandbox.title}</div>
        <div>{sandbox.lastAccessedAt}</div>
      </Card>
    </InteractiveOverlay>
  );
};

const Card = styled.div`
  background-color: #1d1d1d;

  &:hover:not(:has(button:hover):not(:has(a:hover))) {
    background-color: #252525;
  }

  border-radius: 4px;
  overflow: hidden;
`;
