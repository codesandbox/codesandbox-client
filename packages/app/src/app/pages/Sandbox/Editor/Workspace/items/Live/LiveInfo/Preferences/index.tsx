import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { SubTitle } from '../elements';

import { ChatEnabled } from './ChatEnabled';
import { HideNotifications } from './HideNotifications';

export const Preferences: FunctionComponent = () => {
  const {
    state: {
      live: { isOwner },
    },
  } = useOvermind();

  return (
    <Margin top={1}>
      <SubTitle>Preferences</SubTitle>

      {isOwner && <ChatEnabled />}

      <HideNotifications />
    </Margin>
  );
};
