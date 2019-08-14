import ProgressButton from '@codesandbox/common/lib/components/ProgressButton';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import track from '@codesandbox/common/lib/utils/analytics';
import { inject, hooksObserver } from 'app/componentConnectors';
import React, { useEffect } from 'react';

import SignInButton from 'app/pages/common/SignInButton';

import { Description } from '../../elements';

interface Props {
  id: string;
  message: string | JSX.Element;
  store: any;
  signals: any;
}

export const More = inject('store', 'signals')(
  hooksObserver(
    ({
      id,
      message,
      signals: {
        editor: { forkSandboxClicked },
      },
      store: {
        isLoggedIn,
        editor: { isForkingSandbox },
      },
    }: Props) => {
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
    }
  )
);
