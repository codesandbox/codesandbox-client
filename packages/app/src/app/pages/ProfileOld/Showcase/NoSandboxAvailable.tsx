import React, { FunctionComponent } from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import { useOvermind } from 'app/overmind';

import { ErrorTitle } from './elements';

export const NoSandboxAvailable: FunctionComponent = () => {
  const {
    actions: {
      profile: { selectSandboxClicked },
    },
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
          } have a showcased sandbox yet`}
        </ErrorTitle>
        {isProfileCurrentUser && (
          <Centered horizontal>
            <Margin top={1}>
              <Button onClick={() => selectSandboxClicked()} small>
                Select Sandbox
              </Button>
            </Margin>
          </Centered>
        )}
      </Margin>
    </Centered>
  );
};
