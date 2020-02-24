import React, { FunctionComponent } from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';

import { useOvermind } from 'app/overmind';

import { ErrorTitle } from './elements';

export const NoSandboxAvailable: FunctionComponent = () => {
  const {
    state: {
      profile: { isProfileCurrentUser },
    },
  } = useOvermind();

  return (
    <Centered horizontal vertical>
      <Margin top={4}>
        <ErrorTitle>
          {`${
            isProfileCurrentUser ? `You don't` : `This user doesn't`
          } have any sandboxes yet`}
        </ErrorTitle>
      </Margin>
    </Centered>
  );
};
