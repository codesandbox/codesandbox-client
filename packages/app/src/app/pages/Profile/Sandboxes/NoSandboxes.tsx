import React from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { ErrorTitle } from './elements';

const prefix = {
  currentSandboxes: ["You don't have", "This user doesn't have"],
  currentLikedSandboxes: ["You haven't liked", "This user didn't like"],
};

export const NoSandboxes = ({ source, isCurrentUser }) => (
  <Centered vertical horizontal>
    <Margin top={4}>
      <ErrorTitle>
        {prefix[source][isCurrentUser ? 0 : 1]} any sandboxes yet
      </ErrorTitle>
    </Margin>
  </Centered>
);
