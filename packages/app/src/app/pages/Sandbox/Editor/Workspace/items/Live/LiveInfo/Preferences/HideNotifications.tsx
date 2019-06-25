import Switch from '@codesandbox/common/lib/components/Switch';
import React from 'react';

import { useSignals, useStore } from 'app/store';

import { Preference, PreferencesContainer } from './elements';

export const HideNotifications = () => {
  const {
    live: { onToggleNotificationsHidden },
  } = useSignals();
  const {
    live: { notificationsHidden },
  } = useStore();

  return (
    <PreferencesContainer>
      <Preference>Hide notifications</Preference>

      <Switch
        offMode
        onClick={onToggleNotificationsHidden}
        right={notificationsHidden}
        secondary
        small
      />
    </PreferencesContainer>
  );
};
