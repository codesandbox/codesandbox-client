import React from 'react';
import SettingsIcon from 'react-icons/lib/md/settings';
import { Action } from './Action';
import { inject } from 'app/componentConnectors';

export const PreferencesButton = inject('signals')(
  ({ signals: { modalOpened } }) => (
    <Action
      onClick={() => modalOpened({ modal: 'preferences' })}
      tooltip="Preferences"
      Icon={SettingsIcon}
    />
  )
);
