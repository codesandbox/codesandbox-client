import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import track from '@codesandbox/common/lib/utils/analytics';
import { observer } from 'mobx-react-lite';
import React, { useEffect } from 'react';

import SignInButton from 'app/pages/common/SignInButton';
import { useSignals, useStore } from 'app/store';

import { Description } from '../../elements';

interface Props {
  id: string;
  message: string | JSX.Element;
}

export const More = observer(({ id, message }: Props) => {
  const {
    editor: { forkSandboxClicked },
  } = useSignals();
  const {
    isLoggedIn,
    editor: { isForkingSandbox },
  } = useStore();

  useEffect(() => track('Workspace - More Opened', { id }), [id]);

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
});
