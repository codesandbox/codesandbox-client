import Centered from '@codesandbox/common/es/components/flex/Centered';
import Margin from '@codesandbox/common/es/components/spacing/Margin';
import { useOvermind } from 'app/overmind';
import React, { FunctionComponent } from 'react';

import { ErrorTitle } from './elements';

const prefix = {
  currentLikedSandboxes: [`You haven't liked`, `This user didn't like`],
  currentSandboxes: [`You don't have`, `This user doesn't have`],
};

type SandboxSource = 'currentLikedSandboxes' | 'currentSandboxes';
type Props = {
  source: SandboxSource;
};
export const NoSandboxes: FunctionComponent<Props> = ({ source }) => {
  const {
    state: {
      profile: { isProfileCurrentUser },
    },
  } = useOvermind();

  return (
    <Centered horizontal vertical>
      <Margin top={4}>
        <ErrorTitle>
          {`${prefix[source][isProfileCurrentUser ? 0 : 1]} any sandboxes yet`}
        </ErrorTitle>
      </Margin>
    </Centered>
  );
};
