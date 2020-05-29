import Centered from '@codesandbox/common/es/components/flex/Centered';
import Margin from '@codesandbox/common/es/components/spacing/Margin';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

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
