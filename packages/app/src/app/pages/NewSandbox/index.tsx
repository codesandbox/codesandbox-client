import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import {
  COLUMN_MEDIA_THRESHOLD,
  CreateSandbox,
} from 'app/components/CreateNewSandbox/CreateSandbox';
import { useOvermind } from 'app/overmind';
import { Navigation } from 'app/pages/common/Navigation';
import React, { FunctionComponent, useEffect } from 'react';
import Media from 'react-media';

import { MaxWidth } from './elements';

export const NewSandbox: FunctionComponent = () => {
  const {
    state: { isAuthenticating },
    actions: { sandboxPageMounted },
  } = useOvermind();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  if (isAuthenticating) {
    return null;
  }

  return (
    <MaxWidth>
      <Margin horizontal={1.5} style={{ height: '100%' }} vertical={1.5}>
        <Navigation title="New Sandbox" />

        <Margin top={5}>
          <Centered horizontal vertical>
            <Media query={`(min-width: ${COLUMN_MEDIA_THRESHOLD}px)`}>
              {matches => (
                <Margin
                  style={{
                    maxWidth: '100%',
                    width: matches ? 1200 : 900,
                  }}
                  top={2}
                >
                  <CreateSandbox />
                </Margin>
              )}
            </Media>
          </Centered>
        </Margin>
      </Margin>
    </MaxWidth>
  );
};
