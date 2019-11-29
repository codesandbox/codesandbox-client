import React, { useEffect } from 'react';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import MaxWidth from '@codesandbox/common/lib/components/flex/MaxWidth';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Navigation } from 'app/pages/common/Navigation';
import { useOvermind } from 'app/overmind';

import {
  CreateSandbox,
  COLUMN_MEDIA_THRESHOLD,
} from 'app/components/CreateNewSandbox/CreateSandbox';

export const NewSandbox: React.FC = () => {
  const {
    actions: { sandboxPageMounted },
  } = useOvermind();

  useEffect(() => {
    sandboxPageMounted();
  }, [sandboxPageMounted]);

  return (
    <MaxWidth
      css={`
        height: 100vh;
      `}
    >
      <Margin horizontal={1.5} style={{ height: '100%' }} vertical={1.5}>
        <Navigation title="New Sandbox" />
        <Margin top={5}>
          <Centered horizontal vertical>
            <Margin
              style={{
                maxWidth: '100%',
                width: COLUMN_MEDIA_THRESHOLD ? 1200 : 900,
              }}
              top={2}
            >
              <CreateSandbox />
            </Margin>
          </Centered>
        </Margin>
      </Margin>
    </MaxWidth>
  );
};
