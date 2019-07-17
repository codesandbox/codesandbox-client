import Switch from '@codesandbox/common/lib/components/Switch';
import { observer } from 'mobx-react-lite';
import React from 'react';

import { useSignals, useStore } from 'app/store';

import { Preference, PreferencesContainer } from './elements';

export const ChatEnabled = observer(() => {
  const {
    live: { onChatEnabledChange },
  } = useSignals();
  const {
    live: {
      roomInfo: { chatEnabled },
    },
  } = useStore();
  const toggleChatEnabled = () => {
    onChatEnabledChange({ enabled: !chatEnabled });
  };

  return (
    <PreferencesContainer>
      <Preference>Chat enabled</Preference>

      <Switch
        offMode
        onClick={toggleChatEnabled}
        right={chatEnabled}
        small
        secondary
      />
    </PreferencesContainer>
  );
});
