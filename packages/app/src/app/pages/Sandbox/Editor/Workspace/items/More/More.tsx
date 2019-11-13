import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import track from '@codesandbox/common/lib/utils/analytics';
import React, { FunctionComponent, useEffect } from 'react';

import { useOvermind } from 'app/overmind';
import { SignInButton } from 'app/pages/common/SignInButton';

import { Description } from '../../elements';

interface Props {
  id: string;
  message: string | JSX.Element;
}

export const More: FunctionComponent<Props> = ({ id, message }) => {
  const {
    actions: {
      editor: { forkSandboxClicked },
    },
    state: {
      isLoggedIn,
      editor: { isForkingSandbox },
    },
  } = useOvermind();

  useEffect(() => {
    track('Workspace - More Opened', { id });
  }, [id]);

  return (
    <div>
      <Description>{message}</Description>

      <Margin margin={1}>
        {!isLoggedIn ? (
          <SignInButton block />
        ) : (
          <ProgressButton
            block
            loading={isForkingSandbox}
            onClick={() => forkSandboxClicked()}
            small
          >
            {isForkingSandbox ? 'Forking Sandbox...' : 'Fork Sandbox'}
          </ProgressButton>
        )}
      </Margin>
    </div>
  );
};
