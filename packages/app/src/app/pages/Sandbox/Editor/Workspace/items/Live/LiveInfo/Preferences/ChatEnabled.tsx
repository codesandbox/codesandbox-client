import Switch from '@codesandbox/common/lib/components/Switch';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Preference, PreferencesContainer } from './elements';

export const ChatEnabled: FunctionComponent = () => {
  const {
    actions: {
      live: { onChatEnabledChange },
    },
    state: {
      live: {
        roomInfo: { chatEnabled },
      },
    },
  } = useOvermind();

  return (
    <PreferencesContainer>
      <Preference>Chat enabled</Preference>

      <Switch
        offMode
        onClick={() => onChatEnabledChange(!chatEnabled)}
        right={chatEnabled}
        secondary
        small
      />
    </PreferencesContainer>
  );
};
