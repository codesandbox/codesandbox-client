import Switch from '@codesandbox/common/lib/components/Switch';
import React, { FunctionComponent } from 'react';

import { useOvermind } from 'app/overmind';

import { Preference, PreferencesContainer } from './elements';

export const HideNotifications: FunctionComponent = () => {
  const {
    actions: {
      live: { onToggleNotificationsHidden },
    },
    state: {
      live: { notificationsHidden },
    },
  } = useOvermind();

  return (
    <PreferencesContainer>
      <Preference>Hide notifications</Preference>

      <Switch
        offMode
        onClick={() => onToggleNotificationsHidden()}
        right={notificationsHidden}
        secondary
        small
      />
    </PreferencesContainer>
  );
};
