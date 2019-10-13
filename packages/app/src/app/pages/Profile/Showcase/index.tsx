import React from 'react';
import { useOvermind } from 'app/overmind';

import Column from '@codesandbox/common/lib/components/flex/Column';
import Centered from '@codesandbox/common/lib/components/flex/Centered';
import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { Button } from '@codesandbox/common/lib/components/Button';

import SandboxInfo from './SandboxInfo';
import ShowcasePreview from '../../common/ShowcasePreview';

import { ErrorTitle } from './elements';

export const Showcase: React.FC<{}> = () => {
  const {
    state: {
      profile,
      profile: { isLoadingProfile },
      preferences: { settings },
    },
    actions: {
      profile: { selectSandboxClicked },
    },
  } = useOvermind();
  const sandbox = profile.showcasedSandbox;
  const isCurrentUser = profile.isProfileCurrentUser;

  const openModal = () => {
    selectSandboxClicked();
  };

  if (isLoadingProfile) {
    return (
      <Centered vertical horizontal>
        <Margin top={4}>
          <ErrorTitle>Loading showcased sandbox...</ErrorTitle>
        </Margin>
      </Centered>
    );
  }

  if (!sandbox) {
    return (
      <Centered vertical horizontal>
        <Margin top={4}>
          <ErrorTitle>
            {isCurrentUser ? "You don't" : "This user doesn't"} have any
            sandboxes yet
          </ErrorTitle>
        </Margin>
      </Centered>
    );
  }

  return (
    <Column alignItems="center">
      <Margin top={1}>
        {isCurrentUser && (
          <Button small onClick={openModal}>
            Change Sandbox
          </Button>
        )}
      </Margin>
      <Margin top={2} style={{ width: '100%' }}>
        <Column alignItems="initial">
          <div style={{ flex: 2 }}>
            <ShowcasePreview sandbox={sandbox} settings={settings} />
          </div>
          <div style={{ flex: 1 }}>
            <SandboxInfo sandbox={sandbox} />
          </div>
        </Column>
      </Margin>
    </Column>
  );
};
