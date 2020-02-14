import React, { FunctionComponent } from 'react';
import Column from '@codesandbox/common/lib/components/flex/Column';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import { useOvermind } from 'app/overmind';

import ShowcasePreview from '../../common/ShowcasePreview';

import { SandboxInfoContainer, ShowcasePreviewContainer } from './elements';
import { LoadingSandbox } from './LoadingSandbox';
import { NoSandboxAvailable } from './NoSandboxAvailable';
import { SandboxInfo } from './SandboxInfo';

export const Showcase: FunctionComponent = () => {
  const {
    actions: {
      profile: { selectSandboxClicked },
    },
    state: {
      preferences: { settings },
      profile: { isLoadingProfile, isProfileCurrentUser, showcasedSandbox },
    },
  } = useOvermind();

  if (isLoadingProfile) {
    return <LoadingSandbox />;
  }

  if (!showcasedSandbox) {
    return <NoSandboxAvailable />;
  }

  return (
    <Column alignItems="center">
      <Margin top={1}>
        {isProfileCurrentUser && (
          <Button onClick={() => selectSandboxClicked()} small>
            Change Sandbox
          </Button>
        )}
      </Margin>

      <Margin top={2} style={{ width: '100%' }}>
        <Column alignItems="initial">
          <ShowcasePreviewContainer>
            <ShowcasePreview sandbox={showcasedSandbox} settings={settings} />
          </ShowcasePreviewContainer>

          <SandboxInfoContainer>
            <SandboxInfo />
          </SandboxInfoContainer>
        </Column>
      </Margin>
    </Column>
  );
};
