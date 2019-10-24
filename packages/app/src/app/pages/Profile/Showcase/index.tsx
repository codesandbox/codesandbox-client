import React, { FunctionComponent } from 'react';
import { useOvermind } from 'app/overmind';

import Column from '@codesandbox/common/lib/components/flex/Column';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from '../../common/ShowcasePreview';

import { ErrorTitle } from './elements';

export const Showcase: FunctionComponent = () => {
  const {
    state: {
      profile: { isLoadingProfile, showcasedSandbox, isProfileCurrentUser },
      preferences: { settings },
    },
    actions: {
      profile: { selectSandboxClicked },
    },
  } = useOvermind();

  if (isLoadingProfile) {
    return (
      <Centered vertical horizontal>
        <Margin top={4}>
          <ErrorTitle>Loading showcased sandbox...</ErrorTitle>
        </Margin>
      </Centered>
    );
  }
  if (!showcasedSandbox) {
    return (
      <Centered vertical horizontal>
        <Margin top={4}>
          <ErrorTitle>
            {isProfileCurrentUser ? "You don't" : "This user doesn't"} have any
            sandboxes yet
          </ErrorTitle>
        </Margin>
      </Centered>
    );
  }
  return (
    <Column alignItems="center" justifyContent="normal">
      <Margin top={1}>
        {isProfileCurrentUser && (
          <Button small onClick={selectSandboxClicked}>
            Change Sandbox
          </Button>
        )}
      </Margin>
      <Margin top={2} style={{ width: '100%' }}>
        <Column alignItems="initial" justifyContent="normal">
          <div style={{ flex: 2 }}>
            <ShowcasePreview sandbox={showcasedSandbox} settings={settings} />
          </div>
          <div style={{ flex: 1 }}>
            <SandboxInfo sandbox={showcasedSandbox} />
          </div>
        </Column>
      </Margin>
    </Column>
  );
};
