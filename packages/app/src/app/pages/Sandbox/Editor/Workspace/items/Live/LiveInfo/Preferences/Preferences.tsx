import Margin from '@codesandbox/common/lib/components/spacing/Margin';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useStore } from 'app/store';

import { SubTitle } from '../elements';

import { ChatEnabled } from './ChatEnabled';
import { HideNotifications } from './HideNotifications';

export const Preferences = observer(() => {
  const {
    live: { isOwner },
  } = useStore();

  return (
    <Margin top={1}>
      <SubTitle>Preferences</SubTitle>

      {isOwner && <ChatEnabled />}

      <HideNotifications />
    </Margin>
  );
});
